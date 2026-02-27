/**
 * FCM 远程推送通知客户端
 * 用于原生应用中接收远程推送消息
 */

import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { registerDeviceToken } from '@/actions/device-token';

/**
 * 初始化 FCM 推送通知
 * 请求权限、获取 token、注册监听器
 */
export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;

  // 1. 请求权限
  const perm = await FirebaseMessaging.requestPermissions();
  if (perm.receive !== 'granted') {
    console.log('[Push] Permission denied');
    return;
  }

  // 2. 获取 FCM token
  const { token } = await FirebaseMessaging.getToken();
  const platform = Capacitor.getPlatform(); // 'android' | 'ios'
  console.log('[Push] FCM token:', token.substring(0, 20) + '...');

  // 3. 上报 token 到后端
  try {
    await registerDeviceToken(token, platform);
    console.log('[Push] Token registered');
  } catch (e) {
    console.error('[Push] Failed to register token:', e);
  }

  // 4. 监听 token 刷新
  await FirebaseMessaging.addListener('tokenReceived', async ({ token: newToken }) => {
    console.log('[Push] Token refreshed');
    try {
      await registerDeviceToken(newToken, platform);
    } catch (e) {
      console.error('[Push] Failed to update token:', e);
    }
  });

  // 5. 监听前台消息
  await FirebaseMessaging.addListener('notificationReceived', (notification) => {
    console.log('[Push] Foreground:', notification);
  });

  // 6. 监听通知点击（后台/冷启动）
  await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
    console.log('[Push] Tapped:', event);
  });
}
