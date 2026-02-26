'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { createVoicicaPurchaseCheckout } from '@/actions/voicica-purchase';
import LoginModal from '@/components/native/LoginModal';
import LoadingDots from '@/components/native/common/LoadingDots';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  VOICICA_RATE,
  STRIPE_FEE_USD,
  MIN_PURCHASE_USD,
  MAX_PURCHASE_USD,
  QUICK_AMOUNTS,
  calculateVoicica,
  calculateEstimatedValue,
} from '@/config/native/voicica-purchase';

const CloseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/**
 * Native Subscribe Page — VOICICA Swap UI
 * 类似 Uniswap 的自由兑换界面
 */
export default function NativeSubscribePage() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { t } = useLanguage();

  const [amountStr, setAmountStr] = useState('10');
  const [processing, setProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const amountUsd = parseFloat(amountStr) || 0;
  const voicicaAmount = calculateVoicica(amountUsd);
  const estimatedValue = calculateEstimatedValue(credits);
  const isValidAmount = amountUsd >= MIN_PURCHASE_USD && amountUsd <= MAX_PURCHASE_USD;

  const handleAmountChange = (value: string) => {
    // 只允许数字和小数点，最多2位小数
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmountStr(cleaned);
  };

  const handleQuickAmount = (amount: number) => {
    setAmountStr(String(amount));
  };

  const handleBuy = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!isValidAmount) return;

    setProcessing(true);
    try {
      const successUrl = `${window.location.origin}/native/payment/success`;
      const cancelUrl = `${window.location.origin}/native/subscribe`;

      const data = await createVoicicaPurchaseCheckout(amountUsd, successUrl, cancelUrl);

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a1a] flex flex-col overflow-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent pointer-events-none" />

      {/* Close button */}
      <button
        onClick={() => router.push('/native')}
        className="absolute left-4 z-20 w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-full text-gray-300 hover:text-white transition-colors"
        style={{ top: 'calc(var(--safe-area-inset-top, 0px) + 8px)' }}
      >
        <CloseIcon />
      </button>

      {/* Asset balance */}
      <div
        className="relative z-10 text-center py-6"
        style={{ marginTop: 'calc(var(--safe-area-inset-top, 0px) + 56px)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-amber-400 text-lg">&#10022;</span>
          <span className="text-4xl font-bold text-amber-400">
            {creditsLoading ? <LoadingDots /> : credits.toLocaleString()}
          </span>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wider">
          {t('native.subscribe.balance')}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          {t('native.subscribe.estimatedValue', { value: estimatedValue.toFixed(2) })}
        </p>
      </div>

      {/* Swap card area */}
      <div className="relative z-10 flex-1 px-4 space-y-3">
        {/* You Pay card */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-4">
          <p className="text-slate-400 text-sm mb-3">{t('native.subscribe.youPay')}</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-2xl font-medium">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 bg-transparent text-white text-3xl font-bold outline-none placeholder-slate-600"
              placeholder="0.00"
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">
            {t('native.subscribe.fee')}
          </p>
        </div>

        {/* Arrow divider */}
        <div className="flex justify-center -my-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* You Get card */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-4">
          <p className="text-slate-400 text-sm mb-3">{t('native.subscribe.youGet')}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-amber-300 text-3xl font-bold">
              {voicicaAmount.toLocaleString()}
            </span>
            <span className="text-amber-400/60 text-sm font-medium">VOICICA</span>
          </div>
        </div>

        {/* Quick amount buttons */}
        <div className="flex gap-2">
          {QUICK_AMOUNTS.map((amount) => {
            const isSelected = amountStr === String(amount);
            return (
              <button
                key={amount}
                onClick={() => handleQuickAmount(amount)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                    : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                ${amount}
              </button>
            );
          })}
        </div>

        {/* Rate info */}
        <p className="text-center text-slate-500 text-xs pt-1">
          {t('native.subscribe.rate')}
        </p>

        {/* Min amount hint */}
        {amountUsd > 0 && amountUsd < MIN_PURCHASE_USD && (
          <p className="text-center text-red-400/80 text-xs">
            {t('native.subscribe.minAmount')}
          </p>
        )}
      </div>

      {/* Bottom buy button */}
      <div
        className="relative z-20 px-4 py-4 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a] to-transparent"
        style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <button
          onClick={handleBuy}
          disabled={processing || !isValidAmount}
          className="w-full py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{
            background: isValidAmount && !processing
              ? 'linear-gradient(90deg, #D97706, #F59E0B, #EAB308)'
              : 'linear-gradient(90deg, #44403c, #57534e, #44403c)',
          }}
        >
          {processing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('native.subscribe.processing')}
            </>
          ) : (
            t('native.subscribe.buyButton')
          )}
        </button>
      </div>

      {/* Login modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
