'use client';

import { useEffect, useMemo, useState } from 'react';
import { subscriptionAPI } from '@/lib/api';
import { PricingPlan, SubscriptionPlan } from '@/types/subscription';
import { getCurrencyFromLocale } from '@/config/currency';
import { useLanguage } from '@/contexts/LanguageContext';

export type BillingCycle = 'monthly' | 'yearly';

/**
 * Custom hook for managing pricing plans data and state
 */
export function usePricing() {
  const { locale, isReady } = useLanguage();
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription plans from API
  useEffect(() => {
    // 等待 LanguageContext 初始化完成
    if (!isReady) {
      return;
    }
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取配置的支付平台
        const paymentProvider = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'creem') as 'creem' | 'stripe';
        console.log(`Fetching plans for payment provider: ${paymentProvider}`);

        const data = await subscriptionAPI.getPlans({
          platform: paymentProvider,
          active_only: true
        }) as SubscriptionPlan[];
        console.log('Fetched plans:', data);

        // 如果是 Stripe，需要额外查询价格信息
        if (paymentProvider === 'stripe') {
          // 根据当前语言设置获取货币偏好
          const preferredCurrency = getCurrencyFromLocale(locale);
          console.log('Preferred currency:', preferredCurrency);

          const pricingPlans = await Promise.all(
            data.map(async (plan: SubscriptionPlan): Promise<PricingPlan> => {
              try {
                const prices = await subscriptionAPI.getStripePrices(plan.product_id);
                console.log(`Prices for ${plan.product_id}:`, prices);

                // 先尝试找到匹配用户偏好货币的激活价格（后端返回的是小写）
                let selectedPrice = prices.find(
                  p => p.active && p.currency.toUpperCase() === preferredCurrency
                );

                // 如果没有找到匹配的货币，优先使用 USD
                if (!selectedPrice) {
                  selectedPrice = prices.find(p => p.active && p.currency.toUpperCase() === 'USD');
                }

                // 如果还是没有找到，使用第一个激活的价格
                if (!selectedPrice) {
                  selectedPrice = prices.find(p => p.active);
                }

                if (selectedPrice) {
                  return {
                    ...plan,
                    priceInfo: {
                      price: selectedPrice.unit_amount,
                      currency: selectedPrice.currency,
                      billing_type: selectedPrice.billing_type,
                      billing_period: selectedPrice.billing_period === 'month' ? 'every-month' : 'every-year',
                    }
                  };
                }
                return plan; // Free 计划没有价格信息
              } catch (err) {
                console.error(`Failed to fetch prices for ${plan.product_id}:`, err);
                return plan;
              }
            })
          );
          setPlans(pricingPlans);
        } else {
          // Creem 的价格信息需要从计划中提取（如果有）
          setPlans(data.map(plan => ({ ...plan })));
        }
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [locale, isReady]);

  // Return all plans sorted by sort_order (不按周期过滤)
  const currentPlans = useMemo(() => {
    if (!plans || plans.length === 0) return [];

    console.log('All plans:', plans);

    // Sort by sort_order
    return [...plans].sort((a, b) => a.sort_order - b.sort_order);
  }, [plans]);

  const handleCycleChange = (newCycle: BillingCycle) => {
    setCycle(newCycle);
  };

  return {
    cycle,
    plans: currentPlans,
    loading,
    error,
    onCycleChange: handleCycleChange,
  };
}