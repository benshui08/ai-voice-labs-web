'use server';

/**
 * VOICICA 直接购买 Server Action
 *
 * 创建 Stripe Checkout Session，用户支付后通过 webhook 发放积分
 */

import { getCurrentUser } from '@/lib/auth-firebase';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCheckoutSession } from '@/lib/stripe-api';
import {
  VOICICA_RATE,
  STRIPE_FEE_USD,
  MIN_PURCHASE_USD,
  MAX_PURCHASE_USD,
} from '@/config/native/voicica-purchase';

export interface VoicicaPurchaseResponse {
  checkout_url: string;
  session_id: string;
}

/**
 * 创建 VOICICA 购买 Checkout Session
 */
export async function createVoicicaPurchaseCheckout(
  amountUsd: number,
  successUrl: string,
  cancelUrl: string,
): Promise<VoicicaPurchaseResponse> {
  const db = await getDb();
  const authUser = await getCurrentUser();
  const userId = authUser.uid;

  // 校验金额范围
  if (amountUsd < MIN_PURCHASE_USD || amountUsd > MAX_PURCHASE_USD) {
    throw new Error(`Amount must be between $${MIN_PURCHASE_USD} and $${MAX_PURCHASE_USD}`);
  }

  // 计算 VOICICA 数量和总费用（美分）
  const voicicaAmount = Math.floor(amountUsd * VOICICA_RATE);
  const totalCents = Math.round((amountUsd + STRIPE_FEE_USD) * 100);

  // 获取用户邮箱
  const [appUser] = await db.select({ email: users.email })
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

  // 构建带 session ID 的 success URL
  const finalSuccessUrl = successUrl.includes('?')
    ? `${successUrl}&request_id={CHECKOUT_SESSION_ID}`
    : `${successUrl}?request_id={CHECKOUT_SESSION_ID}`;

  const sessionParams: Record<string, unknown> = {
    mode: 'payment',
    'payment_method_types[0]': 'card',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: totalCents,
          product_data: {
            name: `${voicicaAmount.toLocaleString()} VOICICA`,
            description: `$${amountUsd.toFixed(2)} + $${STRIPE_FEE_USD.toFixed(2)} fee`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: finalSuccessUrl,
    cancel_url: cancelUrl,
    metadata: {
      type: 'voicica_purchase',
      user_id: userId,
      voicica_amount: String(voicicaAmount),
      usd_amount: String(amountUsd),
      fee: String(STRIPE_FEE_USD),
    },
    ...(appUser?.email && { customer_email: appUser.email }),
  };

  const session = await createCheckoutSession(sessionParams);

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  console.log(`✅ VOICICA Purchase Checkout created: ${session.id}, user: ${userId}, amount: $${amountUsd}, voicica: ${voicicaAmount}`);

  return {
    checkout_url: session.url,
    session_id: session.id,
  };
}
