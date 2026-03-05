/**
 * 激励广告统一配置
 *
 * 支持在 ExoClick（Web）、AdMob（原生）、Appodeal（原生）、Unity Ads（原生）之间切换
 * 支持按场景覆盖原生提供商（如：每日任务用 Unity，其他场景用 AdMob）
 *
 * 使用场景：
 * - Web 端：使用 ExoClick VAST In-Stream
 * - 原生端：使用 AdMob / Appodeal / Unity Ads（根据配置和场景）
 *
 * 提供商选择：
 * - 'exoclick': Web 端激励广告（VAST In-Stream）
 * - 'admob': Google AdMob，最大广告网络，收益稳定
 * - 'appodeal': 广告聚合平台，整合多个广告网络，可能获得更高 eCPM
 * - 'unity': Unity Ads，适用于激励广告场景
 * - 'auto': 自动选择（原生环境用 nativeProvider，Web 用 ExoClick）
 */

/**
 * 激励广告提供商
 */
export type RewardedAdProvider = 'exoclick' | 'admob' | 'appodeal' | 'unity' | 'auto';

/**
 * 原生端广告提供商（当 provider 为 'auto' 时使用）
 */
export type NativeAdProvider = 'admob' | 'appodeal' | 'unity';

/**
 * 广告场景
 * - 'daily_tasks': 每日任务/挖矿中心
 * - 'default': 其他场景（AI Creative Tools 等）
 */
export type AdScene = 'daily_tasks' | 'default';

export interface RewardedAdConfig {
  /**
   * 激励广告提供商
   * - 'exoclick': 强制使用 ExoClick（Web 端）
   * - 'admob': 强制使用 AdMob（原生端）
   * - 'appodeal': 强制使用 Appodeal（原生端）
   * - 'unity': 强制使用 Unity Ads（原生端）
   * - 'auto': 自动选择（原生环境用 nativeProvider，Web 用 ExoClick）
   */
  provider: RewardedAdProvider;

  /**
   * 原生端默认提供商（当 provider 为 'auto' 时使用）
   * @default 'admob'
   */
  nativeProvider: NativeAdProvider;

  /**
   * 按场景覆盖原生提供商
   * 例如：{ daily_tasks: 'unity' } 表示每日任务使用 Unity Ads，其他场景用默认 nativeProvider
   */
  sceneOverrides?: Partial<Record<AdScene, NativeAdProvider>>;
}

/**
 * 开发环境配置
 */
const devConfig: RewardedAdConfig = {
  provider: 'auto',
  nativeProvider: 'admob',
  sceneOverrides: {
    daily_tasks: 'unity', // 每日任务/挖矿中心使用 Unity Ads
  },
};

/**
 * 生产环境配置
 *
 * ⚠️ 切换广告提供商：
 * 1. 使用 AdMob: nativeProvider: 'admob'
 * 2. 使用 Appodeal: nativeProvider: 'appodeal'（需先配置 appodeal.ts）
 * 3. 按场景覆盖: sceneOverrides: { daily_tasks: 'unity' }
 */
const prodConfig: RewardedAdConfig = {
  provider: 'auto', // 自动选择：原生用 nativeProvider，Web 用 ExoClick
  nativeProvider: 'admob',
  sceneOverrides: {
    daily_tasks: 'unity', // 仅每日任务/挖矿中心使用 Unity Ads
  },
};

// 根据环境选择配置
const isProduction = process.env.NODE_ENV === 'production';
export const rewardedAdConfig: RewardedAdConfig = isProduction ? prodConfig : devConfig;

/**
 * 获取当前激励广告提供商
 */
export function getRewardedAdProvider(): RewardedAdProvider {
  return rewardedAdConfig.provider;
}

/**
 * 获取当前应该使用的原生广告提供商
 * @param isNativePlatform 是否在原生平台运行
 * @param scene 广告场景（可选，用于按场景覆盖提供商）
 * @returns 返回当前应该使用的提供商
 */
export function getNativeAdProvider(isNativePlatform: boolean, scene?: AdScene): NativeAdProvider | null {
  const { provider, nativeProvider, sceneOverrides } = rewardedAdConfig;

  // 非原生平台返回 null
  if (!isNativePlatform) {
    return null;
  }

  // 强制使用特定提供商
  if (provider === 'admob') return 'admob';
  if (provider === 'appodeal') return 'appodeal';
  if (provider === 'unity') return 'unity';
  if (provider === 'exoclick') return null; // 强制使用 ExoClick，不使用原生广告

  // auto 模式：检查场景覆盖
  if (scene && sceneOverrides?.[scene]) {
    return sceneOverrides[scene]!;
  }

  // auto 模式：使用配置的 nativeProvider
  return nativeProvider;
}

/**
 * 判断是否应该使用 AdMob
 * @param isNativePlatform 是否在原生平台运行
 * @param scene 广告场景
 */
export function shouldUseAdMob(isNativePlatform: boolean, scene?: AdScene): boolean {
  return getNativeAdProvider(isNativePlatform, scene) === 'admob';
}

/**
 * 判断是否应该使用 Appodeal
 * @param isNativePlatform 是否在原生平台运行
 * @param scene 广告场景
 */
export function shouldUseAppodeal(isNativePlatform: boolean, scene?: AdScene): boolean {
  return getNativeAdProvider(isNativePlatform, scene) === 'appodeal';
}

/**
 * 判断是否应该使用 Unity Ads
 * @param isNativePlatform 是否在原生平台运行
 * @param scene 广告场景
 */
export function shouldUseUnity(isNativePlatform: boolean, scene?: AdScene): boolean {
  return getNativeAdProvider(isNativePlatform, scene) === 'unity';
}

/**
 * 判断是否应该使用 ExoClick
 * @param isNativePlatform 是否在原生平台运行
 */
export function shouldUseExoClick(isNativePlatform: boolean): boolean {
  const { provider } = rewardedAdConfig;

  // 强制使用 ExoClick
  if (provider === 'exoclick') return true;

  // 非原生平台使用 ExoClick（auto 模式）
  if (provider === 'auto' && !isNativePlatform) return true;

  return false;
}
