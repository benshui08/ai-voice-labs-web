'use client';

import { useEffect, useState } from 'react';
import NativeBannerAd from '@/components/native/NativeBannerAd';
import TotalAssetsCard from '@/components/native/TotalAssetsCard';
import FeatureGrid from '@/components/native/FeatureGrid';
import ExploreSection from '@/components/native/ExploreSection';
import ClaimCreditsModal from '@/components/native/ClaimCreditsModal';
import { useCredits } from '@/contexts/CreditsContext';
import { getCreditsGiftConfig } from '@/actions/admin/system-config';

export default function NativePage() {
  const { credits, refreshCredits } = useCredits();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [giftConfig, setGiftConfig] = useState({ threshold: 5000, giftAmount: 10000 });

  useEffect(() => {
    getCreditsGiftConfig().then(setGiftConfig);
  }, []);

  useEffect(() => {
    if (credits < giftConfig.threshold) {
      setShowClaimModal(true);
    }
  }, [credits, giftConfig.threshold]);

  const handleClaimed = () => {
    setShowClaimModal(false);
    refreshCredits();
  };

  return (
    <div className="pt-2 pb-20">
      <NativeBannerAd />
      <TotalAssetsCard />
      <FeatureGrid />
      <ExploreSection />

      {showClaimModal && (
        <ClaimCreditsModal
          giftAmount={giftConfig.giftAmount}
          onClaimed={handleClaimed}
          onClose={() => setShowClaimModal(false)}
        />
      )}
    </div>
  );
}
