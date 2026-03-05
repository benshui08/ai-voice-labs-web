import { getBullBearConfig, getActiveBullBearRound, type BullBearConfigData, type BullBearResult } from '@/actions/bull-bear';

/**
 * Bull or Bear 预加载缓存
 * BullBearCard 点击时调用 prefetch，页面挂载时 consume（一次性）
 */

let configPromise: Promise<BullBearConfigData> | null = null;
let activeRoundPromise: Promise<BullBearResult> | null = null;

export function prefetchBullBear() {
  configPromise = getBullBearConfig();
  activeRoundPromise = getActiveBullBearRound();
}

export function consumeBullBearPrefetch() {
  const result = { configPromise, activeRoundPromise };
  configPromise = null;
  activeRoundPromise = null;
  return result;
}
