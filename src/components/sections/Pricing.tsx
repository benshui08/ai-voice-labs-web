'use client';

import { useEffect, useMemo, useState } from 'react';
import { subscriptionAPI } from '@/services/api';
import { SubscriptionPlanWithPrice } from '@/types/subscription';
import PricingCard from './PricingCard';

type BillingCycle = 'monthly' | 'yearly';

export default function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlanWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取 Creem 平台的订阅计划
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionAPI.getPlans({
          platform: 'creem',
          active_only: true
        });
        console.log('Fetched plans:', data); // 调试日志
        setPlans(data as SubscriptionPlanWithPrice[]);
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 根据计费周期筛选计划
  const currentPlans = useMemo(() => {
    if (!plans || plans.length === 0) return [];

    console.log('All plans:', plans); // 调试日志
    console.log('Current cycle:', cycle); // 调试日志

    const filtered = plans.filter(p => {
      // 根据 billing_period 字段筛选
      if (cycle === 'monthly') {
        return p.billing_period === 'every-month' || p.cycle_days === 30;
      } else {
        return p.billing_period === 'every-year' || p.cycle_days === 365;
      }
    });

    console.log('Filtered plans:', filtered); // 调试日志

    // 按 sort_order 排序
    return filtered.sort((a, b) => a.sort_order - b.sort_order);
  }, [plans, cycle]);

  // 加载状态
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pricing</h2>
          <p className="text-gray-600 mt-2">Choose the plan that best suits your needs.</p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-500">Loading pricing plans...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pricing</h2>
        <p className="text-gray-600 mt-2">Choose the plan that best suits your needs.</p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center mb-10">
        <div className="relative flex items-center rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
              cycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle('yearly')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
              cycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>

          {/* 33% OFF Badge - Only show for yearly */}
          {cycle === 'yearly' && (
            <span className="absolute -top-3 right-1 select-none">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 text-white text-[10px] font-semibold px-2 py-1 shadow">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-7.5L2 10h7l3-7z" />
                </svg>
                33% OFF
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      {currentPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {currentPlans.map((plan, index) => (
            <PricingCard
              key={plan.id || index}
              plan={plan}
              cycle={cycle}
              isRecommended={plan.sort_order === 0 || index === 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-500 mb-4">
            No plans available for {cycle} billing
          </div>
          <button
            onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Try {cycle === 'monthly' ? 'yearly' : 'monthly'} plans
          </button>
        </div>
      )}
    </section>
  );
}
