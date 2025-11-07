'use client';

import { useState } from 'react';
import { PricingPlans } from '@/components/features/pricing';
import { usePricingByType, ProductType } from '@/components/features/pricing/hooks/usePricingByType';
import ProductTypeTabs from '@/components/features/pricing/components/ProductTypeTabs';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Upgrade Page
 *
 * Displays subscription plans with tabs to switch between
 * Text to Voice and Voice Clone subscription types
 */
export default function UpgradePage() {
  const { t } = useLanguage();
  const [productType, setProductType] = useState<ProductType>('text_to_speech');

  // Use custom hook for all business logic
  const { cycle, plans, loading, error, onCycleChange } = usePricingByType({ productType });

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type);
  };

  // Get page title based on product type
  const getPageTitle = () => {
    if (productType === 'text_to_speech') {
      return t('upgrade.title.textToVoice');
    }
    return t('upgrade.title.voiceClone');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('upgrade.header.title')}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {t('upgrade.header.description')}
          </p>
        </div>
      </div>

      {/* Product Type Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <ProductTypeTabs activeType={productType} onChange={handleProductTypeChange} />
      </div>

      {/* Pricing Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          {getPageTitle()}
        </h2>

        <PricingPlans
          plans={plans}
          cycle={cycle}
          loading={loading}
          error={error}
          onCycleChange={onCycleChange}
        />
      </div>
    </div>
  );
}