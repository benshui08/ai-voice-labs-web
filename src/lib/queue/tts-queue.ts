/**
 * TTS 任务队列配置 - 使用 Cloudflare Queues
 */
import { getCloudflareContext } from '@opennextjs/cloudflare';

// TTS 任务队列负载
export interface TtsQueuePayload {
  taskId: string;
  userId: string;
  text: string;
  voiceName: string;
  language?: string;
  style?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  creditsCost: number;
  isAnonymous: boolean;
}

/**
 * TTS 任务队列实现
 * 生产环境：使用 Cloudflare Queues（通过 Service Binding 消费）
 * 开发环境：使用 HTTP 调用（方便本地测试，无需 consumer worker）
 */
export const ttsQueue = {
  async enqueue(payload: TtsQueuePayload): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment) {
      // 生产环境：通过 Cloudflare Queue 发送消息
      try {
        console.log('[Queue] 📤 使用 Cloudflare Queue 提交任务:', payload.taskId);

        const { env } = await getCloudflareContext({ async: true });
        await env.TTS_QUEUE.send(payload);

        console.log('[Queue] ✅ Cloudflare Queue 任务已提交:', payload.taskId);
        return;
      } catch (err) {
        console.error('[Queue] ❌ Cloudflare Queue 提交失败:', err);
        throw err;
      }
    }

    // 开发环境：使用 HTTP fallback 直接调用本地 handler
    console.log('[Queue] 📤 使用 HTTP 调用提交任务:', payload.taskId);

    // 异步触发（不等待完成）
    setTimeout(() => {
      fetch('http://localhost:3000/api/queue/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            console.log('[Queue] ✅ HTTP 队列请求成功:', payload.taskId);
          } else {
            console.error('[Queue] ❌ HTTP 队列请求失败:', response.status);
          }
        })
        .catch((err) => {
          console.error('[Queue] ❌ HTTP 队列调用异常:', err);
        });
    }, 0);

    console.log('[Queue] ⚡ 任务已提交（HTTP fallback），立即返回');
  }
};
