'use client';

import { useState } from 'react';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import { claimFreeCredits } from '@/actions/claimCredits';
import { formatCredits } from '@/utils/formatCredits';

interface ClaimCreditsModalProps {
  giftAmount: number;
  onClaimed: () => void;
  onClose: () => void;
}

export default function ClaimCreditsModal({ giftAmount, onClaimed, onClose }: ClaimCreditsModalProps) {
  const [phase, setPhase] = useState<'idle' | 'ad' | 'claiming' | 'success' | 'error'>('idle');
  const { showRewardedAd } = useRewardedAd();

  const handleClaim = async () => {
    setPhase('ad');
    const result = await showRewardedAd();
    if (!result.success) {
      setPhase('error');
      return;
    }
    setPhase('claiming');
    const res = await claimFreeCredits(giftAmount);
    if (res.success) {
      setPhase('success');
      setTimeout(() => {
        onClaimed();
      }, 1800);
    } else {
      setPhase('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ paddingBottom: 'var(--safe-area-inset-bottom, 0px)' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div className="relative w-full bg-[#0f0f24] rounded-t-3xl px-6 pt-8 pb-10 flex flex-col items-center text-center animate-slide-up">

        {phase === 'success' ? (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-white text-xl font-bold mb-1">Credits Received!</h2>
            <p className="text-purple-300 text-base font-semibold">
              +{formatCredits(giftAmount)} credits added
            </p>
          </>
        ) : (
          <>
            {/* Gift icon with glow */}
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 text-4xl"
              style={{ boxShadow: '0 0 32px rgba(168,85,247,0.5)' }}
            >
              🎁
            </div>

            <h2 className="text-white text-xl font-bold mb-1">You have a gift!</h2>
            <p className="text-gray-400 text-sm mb-1">
              Claim <span className="text-white font-semibold">{formatCredits(giftAmount)} free credits</span>
            </p>
            <p className="text-gray-500 text-xs mb-7">Watch a short ad to receive your credits</p>

            {phase === 'error' && (
              <p className="text-red-400 text-xs mb-4">Ad failed to load. Please try again.</p>
            )}

            <button
              onClick={handleClaim}
              disabled={phase === 'ad' || phase === 'claiming'}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base disabled:opacity-60 transition-opacity"
            >
              {phase === 'ad' ? 'Loading Ad...' : phase === 'claiming' ? 'Claiming...' : '🎬 Watch Ad & Claim'}
            </button>

            <button
              onClick={onClose}
              disabled={phase === 'ad' || phase === 'claiming'}
              className="mt-3 text-gray-500 text-sm py-2"
            >
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
