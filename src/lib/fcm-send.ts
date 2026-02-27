/**
 * FCM HTTP v1 API 推送发送工具
 *
 * 使用 jose 生成 JWT，兼容 Cloudflare Workers（不依赖 firebase-admin SDK）
 * 环境变量：FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_PROJECT_ID
 */

import { SignJWT, importPKCS8 } from 'jose';
import { getDb } from '@/lib/db';
import { deviceTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 缓存 access token（有效期 1 小时，缓存 50 分钟）
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * 获取 Google OAuth2 access token（用于 FCM API 认证）
 */
async function getAccessToken(): Promise<string> {
  // 检查缓存
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!clientEmail || !rawPrivateKey) {
    throw new Error('FCM credentials not configured: FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY');
  }

  // 处理私钥格式
  let privateKeyPem = rawPrivateKey;
  if (privateKeyPem.includes('\\n')) {
    privateKeyPem = privateKeyPem.replace(/\\n/g, '\n');
  }
  if (privateKeyPem.startsWith('"') && privateKeyPem.endsWith('"')) {
    privateKeyPem = privateKeyPem.slice(1, -1).replace(/\\n/g, '\n');
  }

  const privateKey = await importPKCS8(privateKeyPem, 'RS256');

  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to get access token: ${resp.status} ${text}`);
  }

  const data = await resp.json() as { access_token: string };

  // 缓存 50 分钟
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + 50 * 60 * 1000,
  };

  return data.access_token;
}

/**
 * 向指定用户的所有设备发送推送通知
 */
export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const db = await getDb();
  const tokens = await db.select().from(deviceTokens).where(eq(deviceTokens.userId, userId));

  if (tokens.length === 0) {
    console.log(`[FCM] No device tokens for user ${userId}`);
    return;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Firebase project ID not configured');
  }

  const accessToken = await getAccessToken();

  for (const { token } of tokens) {
    try {
      const resp = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body },
              data: data ?? {},
              android: { priority: 'high' },
            },
          }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        console.error(`[FCM] Failed to send to token ${token.substring(0, 20)}...: ${resp.status} ${text}`);

        // token 失效时清理
        if (resp.status === 404 || resp.status === 400) {
          await db.delete(deviceTokens).where(eq(deviceTokens.token, token));
          console.log(`[FCM] Removed invalid token`);
        }
      } else {
        console.log(`[FCM] Sent to token ${token.substring(0, 20)}...`);
      }
    } catch (e) {
      console.error(`[FCM] Error sending to token:`, e);
    }
  }
}
