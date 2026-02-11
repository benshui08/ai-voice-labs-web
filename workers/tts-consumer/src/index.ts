/**
 * TTS Consumer Worker — Cloudflare Queues
 *
 * 消费 tts-tasks 队列消息，通过 Service Binding 调用主应用的 /api/queue/tts
 */

interface Env {
  MAIN_APP: Fetcher;
  QUEUE_CONSUMER_SECRET: string;
}

interface TtsQueueMessage {
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

export default {
  async queue(batch: MessageBatch<TtsQueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const payload = message.body;
      console.log(`[TTS Consumer] Processing task: ${payload.taskId}`);

      try {
        const response = await env.MAIN_APP.fetch('https://voicica.ai/api/queue/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Queue-Secret': env.QUEUE_CONSUMER_SECRET,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log(`[TTS Consumer] Task ${payload.taskId} completed successfully`);
          message.ack();
        } else {
          const errorText = await response.text();
          console.error(`[TTS Consumer] Task ${payload.taskId} failed: ${response.status} ${errorText}`);
          message.retry();
        }
      } catch (error) {
        console.error(`[TTS Consumer] Task ${payload.taskId} error:`, error);
        message.retry();
      }
    }
  },
} satisfies ExportedHandler<Env>;
