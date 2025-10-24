'use client';

import PlansGrid from './components/PlansGrid';
import { PricingPlan } from '@/types/subscription';
import { BillingCycle } from './hooks/usePricing';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingPlansProps {
  plans: PricingPlan[];
  cycle: BillingCycle;
  loading?: boolean;
  error?: string | null;
  onCycleChange: (cycle: BillingCycle) => void;
}

/**
 * Pricing Plans component
 *
 * Main component for displaying subscription pricing plans
 * Composed of:
 * - BillingCycleToggle: Monthly/Yearly toggle
 * - PlansGrid: Grid of pricing cards
 */
export default function PricingPlans({
  plans,
  cycle,
  loading = false,
  error = null,
  onCycleChange,
}: PricingPlansProps) {
  const { t } = useLanguage();

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          {/* Spinning loader */}
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="text-gray-500">{t('pricing.loading')}</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 mb-4">{t('pricing.error')}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          {t('pricing.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Plans Grid */}
      <PlansGrid plans={plans} cycle={cycle} onCycleChange={onCycleChange} />
    </div>
  );
}