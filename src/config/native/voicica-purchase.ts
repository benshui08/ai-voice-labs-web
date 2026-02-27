/**
 * VOICICA 购买配置
 *
 * 用于 Native Subscribe 页面的 Swap UI
 * 汇率与现有 token_value_usd: 0.0001 一致
 */

/** $1 = 10,000 VOICICA */
export const VOICICA_RATE = 10_000;

/** 固定 Stripe 手续费 $0.30/笔 */
export const STRIPE_FEE_USD = 0.30;

/** 最低购买金额 $1 */
export const MIN_PURCHASE_USD = 1;

/** 最高购买金额 $500 */
export const MAX_PURCHASE_USD = 500;

/** 快捷金额按钮 */
export const QUICK_AMOUNTS = [2, 10, 50, 100];

/** 根据美元金额计算 VOICICA 数量 */
export function calculateVoicica(amountUsd: number): number {
  return Math.floor(amountUsd * VOICICA_RATE);
}

/** 根据 VOICICA 数量计算预估美元价值 */
export function calculateEstimatedValue(credits: number): number {
  return credits / VOICICA_RATE;
}
