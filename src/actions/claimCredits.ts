'use server';

import { getUserOrAnonymous } from '@/lib/auth-firebase';
import { addCredits } from '@/lib/credits';
import { ProductType } from '@/config/productType';
import { v4 as uuidv4 } from 'uuid';

export async function claimFreeCredits(giftAmount: number): Promise<{ success: boolean; credits?: number }> {
  try {
    const user = await getUserOrAnonymous();
    await addCredits(
      user.user_id,
      giftAmount,
      ProductType.TEXT_TO_SPEECH,
      user.is_anonymous,
      '免费积分礼包',
      `gift_${uuidv4()}`,
    );
    return { success: true };
  } catch (e) {
    console.error('[claimFreeCredits]', e);
    return { success: false };
  }
}
