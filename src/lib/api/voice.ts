import { apiClient } from './client';
import type { Voice } from '@/types/voice';

/**
 * 语音相关 API
 */

// 获取语音列表
// 语音列表分页响应
export interface VoiceListResponse {
  voices: Voice[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getVoices = async (params?: {
  provider?: string;
  country?: string;
  language?: string;
  locale?: string;
  role?: string;
  gender?: string;
  tag?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}): Promise<VoiceListResponse> => {
  return await apiClient.get<VoiceListResponse>('/api/v1/voices', { params });
};

// 创建语音模型
export const createVoice = (data: unknown) => {
  return apiClient.post('/api/v1/voices', data);
};