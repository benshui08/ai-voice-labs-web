'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyStripePayment } from '@/actions/payment';
import type { StripeVerifyResponse } from '@/types/subscription';
import { useCredits } from '@/contexts/CreditsContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';

type PaymentStatus = 'verifying' | 'success' | 'pending' | 'failed';

interface PaymentDetails {
  orderId: string;
  subscriptionId?: string;
  message?: string;
}

const SuccessIcon = () => (
  <svg className="w-16 h-16 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PendingIcon = () => (
  <svg className="w-16 h-16 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FailedIcon = () => (
  <svg className="w-16 h-16 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCredits } = useCredits();
  const { refreshSubscription } = useSubscription();
  const { t } = useLanguage();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(5);

  const doVerifyPayment = useCallback(async (params: URLSearchParams) => {
    const requestId = params.get('request_id');
    if (!requestId) {
      throw new Error('Missing Stripe Request ID');
    }

    const response: StripeVerifyResponse = await verifyStripePayment({
      request_id: requestId,
    });

    const details: PaymentDetails = {
      orderId: requestId,
      subscriptionId: response.subscription_id,
      message: response.message,
    };

    setPaymentDetails(details);

    if (response.success && response.payment_status === 'paid') {
      setStatus('success');
      refreshCredits();
      refreshSubscription();
    } else if (response.payment_status === 'unpaid') {
      setStatus('pending');
      setError(response.message);
    } else {
      setStatus('failed');
      setError(response.message || `Payment status: ${response.payment_status}`);
    }
  }, [refreshCredits, refreshSubscription]);

  useEffect(() => {
    const doVerify = async () => {
      try {
        const source = searchParams.get('source');
        if (source === 'google_play') {
          const paymentType = searchParams.get('type');
          const subscriptionId = searchParams.get('subscription_id');
          const creditsAdded = searchParams.get('credits');

          setPaymentDetails({
            orderId: `GP-${subscriptionId || Date.now()}`,
            subscriptionId: subscriptionId || undefined,
            message: paymentType === 'credit_pack'
              ? `${creditsAdded} credits added to your account`
              : 'Google Play purchase verified',
          });
          setStatus('success');
          refreshCredits();
          refreshSubscription();
          return;
        }

        const { auth } = await import('@/lib/firebase');
        await new Promise<void>((resolve) => {
          const unsubscribe = auth.onAuthStateChanged(() => {
            unsubscribe();
            resolve();
          });
          setTimeout(() => {
            unsubscribe();
            resolve();
          }, 5000);
        });

        await doVerifyPayment(searchParams);
      } catch (err) {
        console.error('Payment verification failed:', err);
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'Payment verification failed');
      }
    };

    doVerify();
  }, [searchParams, refreshCredits, refreshSubscription, doVerifyPayment]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (status === 'success' && countdown === 0) {
      const returnUrl = searchParams.get('return_url');
      router.push(returnUrl || '/native');
    }
  }, [status, countdown, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Verifying */}
        {status === 'verifying' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/20 mb-6">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('native.payment.verifying')}
            </h2>
            <p className="text-gray-400">
              {t('native.payment.verifyingDesc')}
            </p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 mb-6">
              <SuccessIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('native.payment.successTitle')}
            </h2>
            <p className="text-gray-400 mb-6">
              {paymentDetails?.message || t('native.payment.successDesc')}
            </p>

            {paymentDetails && (
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 text-left">
                <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                  {t('native.payment.orderSummary')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('native.payment.orderId')}</span>
                    <span className="text-white font-mono text-xs">
                      {paymentDetails.orderId.slice(0, 16)}...
                    </span>
                  </div>
                  {paymentDetails.subscriptionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('native.payment.subscription')}</span>
                      <span className="text-white font-mono text-xs">
                        #{paymentDetails.subscriptionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-gray-500 text-sm mb-4">
              {t('native.payment.redirecting', { seconds: String(countdown) })}
            </p>

            <button
              onClick={() => router.push(searchParams.get('return_url') || '/native')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {searchParams.get('return_url') ? t('native.payment.continue') : t('native.payment.goHome')}
            </button>
          </div>
        )}

        {/* Pending */}
        {status === 'pending' && (
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-500/20 mb-6">
              <PendingIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('native.payment.pendingTitle')}
            </h2>
            <p className="text-gray-400 mb-6">
              {error || t('native.payment.pendingDesc')}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {t('native.payment.checkAgain')}
              </button>
              <button
                onClick={() => router.push('/native')}
                className="w-full border-2 border-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-xl hover:border-gray-600 transition-colors"
              >
                {t('native.payment.goBack')}
              </button>
            </div>
          </div>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 mb-6">
              <FailedIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('native.payment.failedTitle')}
            </h2>
            <p className="text-gray-400 mb-4">
              {error || t('native.payment.failedDesc')}
            </p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-400">
                {t('native.payment.failedHint')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/native/subscribe')}
                className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {t('native.payment.tryAgain')}
              </button>
              <button
                onClick={() => router.push('/native')}
                className="w-full border-2 border-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-xl hover:border-gray-600 transition-colors"
              >
                {t('native.payment.goBack')}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function NativePaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/20 mb-6">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
