'use server';

import { getDb } from '@/lib/db';
import { deviceTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-firebase';

/**
 * 注册/更新设备 FCM token
 * 相同 token 更新 userId（支持用户切换账号场景）
 */
export async function registerDeviceToken(token: string, platform: string) {
  const authUser = await getCurrentUser();
  const db = await getDb();

  const now = new Date().toISOString();

  await db.insert(deviceTokens)
    .values({
      userId: authUser.uid,
      token,
      platform,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: deviceTokens.token,
      set: { userId: authUser.uid, updatedAt: now },
    });
}

/**
 * 删除设备 token（用户登出时调用）
 */
export async function removeDeviceToken(token: string) {
  const db = await getDb();
  await db.delete(deviceTokens).where(eq(deviceTokens.token, token));
}
