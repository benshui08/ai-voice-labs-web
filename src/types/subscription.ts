/**
 * 订阅相关类型定义
 */

// 平台类型
export type Platform = 'google' | 'apple' | 'stripe' | 'creem';

// 订阅计划基础模型
export interface SubscriptionPlan {
  id?: string;
  platform: Platform;
  product_id: string;
  base_plan_id?: string;
  payment_link?: string;
  display_name: Record<string, string>;
  features: Record<string, string[]>;
  credits_per_cycle: number;
  cycle_days: number;
  active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// 带价格信息的订阅计划（API 响应）
export interface SubscriptionPlanWithPrice extends SubscriptionPlan {
  price?: number; // 价格（分）
  currency?: string; // 货币代码 (EUR, USD, CNY)
  billing_type?: string; // 计费类型 (recurring, one-time)
  billing_period?: string; // 计费周期 (every-month, every-year)
}

// 计费周期类型
export type BillingCycle = 'monthly' | 'yearly';
