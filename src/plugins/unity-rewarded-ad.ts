/**
 * Unity Ads 激励视频插件
 *
 * 自定义 Capacitor 插件，直接调用 Unity Ads Android SDK
 * 用于每日任务/挖矿中心场景（与 AdMob 分开）
 */

import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

export interface UnityRewardedAdPlugin {
  /**
   * 初始化 Unity Ads SDK
   */
  initialize(options: { gameId: string; testMode?: boolean }): Promise<void>;

  /**
   * 加载激励视频广告
   */
  loadAd(options: { placementId: string }): Promise<{ loaded: boolean; placementId: string }>;

  /**
   * 显示激励视频广告
   * @returns rewarded=true 表示用户看完获得奖励
   */
  showAd(options?: { placementId?: string }): Promise<{
    completed: boolean;
    rewarded: boolean;
    state: string;
  }>;

  /**
   * 检查广告是否已加载
   */
  isLoaded(): Promise<{ loaded: boolean }>;

  // ==================== 事件监听 ====================

  addListener(
    eventName: 'initialized',
    listener: (data: { initialized: boolean }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'initializationFailed',
    listener: (data: { error: string; message: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adLoaded',
    listener: (data: { loaded: boolean; placementId: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adFailedToLoad',
    listener: (data: { loaded: boolean; error: string; message: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adStarted',
    listener: (data: { placementId: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adCompleted',
    listener: (data: { completed: boolean; rewarded: boolean; state: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adFailedToShow',
    listener: (data: { completed: boolean; rewarded: boolean; error: string; message: string }) => void
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'adClicked',
    listener: (data: { placementId: string }) => void
  ): Promise<PluginListenerHandle>;
}

export const UnityRewardedAd = registerPlugin<UnityRewardedAdPlugin>('UnityRewardedAd');
