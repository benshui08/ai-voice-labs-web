'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import NativeLoadingOverlay from '@/components/native/common/NativeLoadingOverlay';
import { prefetchBullBear } from '@/lib/bullBearPrefetch';
import { getBullBearHomeConfig } from '@/config/appConfig';

/**
 * Bull or Bear 入口卡片 - 显示在 Explore 首页
 * 琥珀色渐变风格，与 CrashGameCard 并列
 */
export default function BullBearCard() {
  const router = useRouter();
  const { t } = useLanguage();
  const config = getBullBearHomeConfig();
  const { navigating, startLoading } = useNavigationLoading();

  const handleNavigate = useCallback(() => {
    prefetchBullBear();
    startLoading();
    router.push('/native/bull-bear');
  }, [router, startLoading]);

  if (!config.show_home_card) return null;

  return (
    <>
      <button onClick={handleNavigate} className="block mx-4 mt-3 w-[calc(100%-2rem)] text-left">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/30 via-[#1a1408]/80 to-[#1a1a35]/80 border border-amber-500/15 backdrop-blur-sm p-4">
          {/* Ambient glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-500/10 blur-[50px] animate-pulse" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-orange-500/[0.06] blur-[40px]" />

          <div className="relative flex items-center gap-4">
            {/* Left: BTC icon */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
              </svg>
            </div>

            {/* Center: text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-white">
                  {t('native.bullBear.title')}
                </h3>
                <span className="relative flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {t('native.bullBear.live')}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/40 truncate">
                {t('native.bullBear.homeSubtitle')}
              </p>
            </div>

            {/* Right: play arrow */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      <NativeLoadingOverlay visible={navigating} />
    </>
  );
}
