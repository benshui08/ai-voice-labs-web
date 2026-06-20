/**
 * Insufficient $VOICICA Modal
 * $VOICICA 不足提示弹窗
 * - 提供两个选项：观看广告领积分 和 购买 $VOICICA
 */
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCredits } from '@/contexts/CreditsContext';
import { getCreditsGiftConfig } from '@/actions/admin/system-config';
import ClaimCreditsModal from '@/components/native/ClaimCreditsModal';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetFreeCredits: () => void;
  requiredCredits?: number;
  currentCredits?: number;
}

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const CoinIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9c0-1 1-2 3-2s3 1 3 2-1 2-3 2-3 1-3 2 1 2 3 2 3-1 3-2" />
  </svg>
);


const ChevronRightIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function InsufficientCreditsModal({
  isOpen,
  onClose,
  onGetFreeCredits,
  requiredCredits,
  currentCredits,
}: InsufficientCreditsModalProps) {
  const { t } = useLanguage();
  const { refreshCredits } = useCredits();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState(10000);

  useEffect(() => {
    getCreditsGiftConfig().then(c => setGiftAmount(c.giftAmount));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  const handleClaimed = () => {
    setShowClaimModal(false);
    refreshCredits();
    onGetFreeCredits();
    onClose();
  };

  const modalContent = (
    <>
      {/* Hide this modal while ClaimCreditsModal is active */}
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[10000]"
        style={{ display: showClaimModal ? 'none' : undefined }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[380px] mx-4 bg-gradient-to-b from-[#2a2a4a] to-[#1a1a3a] rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: 'scaleIn 0.2s ease-out' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <CloseIcon />
          </button>

          <div className="px-6 pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                <CoinIcon />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              {t('native.insufficientCredits.title')}
            </h3>

            <p className="text-gray-400 text-sm text-center mb-6">
              {requiredCredits !== undefined && currentCredits !== undefined
                ? t('native.insufficientCredits.subtitleWithAmount', {
                    required: requiredCredits,
                    current: currentCredits,
                  })
                : t('native.insufficientCredits.subtitle')}
            </p>

            <div className="space-y-3">
              {/* Claim Free Credits */}
              <button
                onClick={() => setShowClaimModal(true)}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all active:scale-[0.98] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shrink-0">
                  🎁
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold">
                    {t('native.insufficientCredits.getFreeCredits')}
                  </p>
                </div>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>

      {showClaimModal && (
        <ClaimCreditsModal
          giftAmount={giftAmount}
          onClaimed={handleClaimed}
          onClose={() => setShowClaimModal(false)}
        />
      )}
    </>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
