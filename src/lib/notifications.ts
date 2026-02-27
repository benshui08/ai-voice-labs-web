/**
 * 本地推送通知服务
 * 用于音乐、Cover 等异步任务完成后通知用户
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

/**
 * 通知类型
 */
export type NotificationType = 'music' | 'cover' | 'voice' | 'image';

/**
 * 通知配置
 */
interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  /** 点击通知后跳转的路径 */
  navigateTo?: string;
}

const notificationConfigs: Record<NotificationType, Record<'success' | 'failure', NotificationConfig>> = {
  music: {
    success: {
      title: '🎵 Music Ready!',
      body: 'Your AI music has been generated successfully.',
      navigateTo: '/native/me?tab=music',
    },
    failure: {
      title: '❌ Music Generation Failed',
      body: 'Something went wrong. Please try again.',
      navigateTo: '/native/create/music',
    },
  },
  cover: {
    success: {
      title: '🎤 Cover Ready!',
      body: 'Your AI cover has been generated successfully.',
      navigateTo: '/native/me?tab=cover',
    },
    failure: {
      title: '❌ Cover Generation Failed',
      body: 'Something went wrong. Please try again.',
      navigateTo: '/native/create/cover',
    },
  },
  voice: {
    success: {
      title: '🔊 Voice Ready!',
      body: 'Your voice has been generated successfully.',
      navigateTo: '/native/me?tab=voices',
    },
    failure: {
      title: '❌ Voice Generation Failed',
      body: 'Something went wrong. Please try again.',
      navigateTo: '/native/create/voice',
    },
  },
  image: {
    success: {
      title: '🖼️ Image Ready!',
      body: 'Your AI image has been generated successfully.',
      navigateTo: '/native/me?tab=image',
    },
    failure: {
      title: '❌ Image Generation Failed',
      body: 'Something went wrong. Please try again.',
      navigateTo: '/native/create/image',
    },
  },
};

/**
 * 检查是否在原生环境中
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNativePlatform()) {
    console.log('[Notifications] Not on native platform, skipping permission request');
    return false;
  }

  try {
    const result = await LocalNotifications.requestPermissions();
    console.log('[Notifications] Permission result:', result);
    return result.display === 'granted';
  } catch (error) {
    console.error('[Notifications] Failed to request permission:', error);
    return false;
  }
}

/**
 * 检查通知权限状态
 */
export async function checkNotificationPermission(): Promise<boolean> {
  if (!isNativePlatform()) {
    return false;
  }

  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('[Notifications] Failed to check permission:', error);
    return false;
  }
}

/**
 * 发送本地通知
 */
export async function sendLocalNotification(
  type: NotificationType,
  status: 'success' | 'failure',
  customBody?: string
): Promise<void> {
  if (!isNativePlatform()) {
    console.log(`[Notifications] Web platform - would show: ${type} ${status}`);
    return;
  }

  // 权限不足时尝试请求一次
  let hasPermission = await checkNotificationPermission();
  if (!hasPermission) {
    hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('[Notifications] No permission, skipping notification');
      return;
    }
    await ensureNotificationChannel();
  }

  const config = notificationConfigs[type][status];
  const notificationId = Math.floor(Math.random() * 100000);

  const options: ScheduleOptions = {
    notifications: [
      {
        id: notificationId,
        title: config.title,
        body: customBody || config.body,
        channelId: 'voicica_default',
        schedule: { at: new Date(Date.now() + 3000) }, // 延迟 3 秒确保系统处理
        extra: {
          type,
          status,
          navigateTo: config.navigateTo,
        },
      },
    ],
  };

  try {
    await LocalNotifications.schedule(options);
    console.log(`[Notifications] Scheduled notification: ${type} ${status}`);
  } catch (error) {
    console.error('[Notifications] Failed to schedule notification:', error);
  }
}

/**
 * 注册通知点击监听器
 * 返回清理函数
 */
export function registerNotificationClickListener(
  onNavigate: (path: string) => void
): () => void {
  if (!isNativePlatform()) {
    return () => {};
  }

  const listener = LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (notification) => {
      console.log('[Notifications] Notification clicked:', notification);
      const navigateTo = notification.notification.extra?.navigateTo;
      if (navigateTo) {
        onNavigate(navigateTo);
      }
    }
  );

  // 返回清理函数
  return () => {
    listener.then((l) => l.remove());
  };
}

/**
 * 创建通知 channel（Android 8+ 必需，iOS 忽略）
 */
async function ensureNotificationChannel(): Promise<void> {
  try {
    await LocalNotifications.createChannel({
      id: 'voicica_default',
      name: 'VoicicaAI Notifications',
      importance: 4, // HIGH
      sound: 'default',
      vibration: true,
    });
    console.log('[Notifications] Channel created');
  } catch {
    // iOS 不支持 channel，静默忽略
  }
}

/**
 * 初始化通知服务
 * 应在 App 启动时调用
 */
export async function initNotifications(): Promise<void> {
  if (!isNativePlatform()) {
    console.log('[Notifications] Not on native platform, skipping init');
    return;
  }

  // 请求权限（Android 13+ 会弹系统弹窗）
  const granted = await requestNotificationPermission();
  console.log('[Notifications] Permission granted:', granted);

  // 创建通知 channel（Android 8+ 必需）
  if (granted) {
    await ensureNotificationChannel();
  }
}
