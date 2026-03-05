'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface RoundResultProps {
  status: 'won' | 'lost' | 'draw' | 'expired';
  betAmount: number;
  direction: string;
  multiplier: number;
  entryPrice: number;
  settlePrice?: number;
  outcome?: string;
  profit: number;
  onPlayAgain: () => void;
}

/**
 * 回合结果展示 — 输赢/平局 + 价格详情 + Play Again
 */
export default function RoundResult({
  status,
  betAmount,
  direction,
  multiplier,
  entryPrice,
  settlePrice,
  outcome,
  profit,
  onPlayAgain,
}: RoundResultProps) {
  const { t } = useLanguage();
  const isWin = status === 'won';
  const isDraw = status === 'draw';

  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Result banner */}
      <div className={`rounded-2xl p-5 text-center ${
        isWin
          ? 'bg-green-500/10 border border-green-500/30'
          : isDraw
          ? 'bg-amber-500/10 border border-amber-500/30'
          : 'bg-red-500/10 border border-red-500/30'
      }`}>
        <div className={`text-2xl font-black ${
          isWin ? 'text-green-400' : isDraw ? 'text-amber-400' : 'text-red-400'
        }`}>
          {isWin ? t('native.bullBear.youWon') : isDraw ? t('native.bullBear.draw') : t('native.bullBear.youLost')}
        </div>
        <div className={`text-3xl font-black mt-1 ${
          isWin ? 'text-green-300' : isDraw ? 'text-amber-300' : 'text-red-300'
        }`}>
          {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
        </div>

        {/* Details grid */}
        <div className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-white/50">
          <span>{t('native.bullBear.bet')}: {betAmount} $V</span>
          <span>{t('native.bullBear.directionLabel')}: {direction === 'bull' ? '↑ Bull' : '↓ Bear'}</span>
          <span>{t('native.bullBear.entryPriceLabel')}: ${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          {settlePrice != null && (
            <span>{t('native.bullBear.settlePriceLabel')}: ${settlePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )}
          {outcome && (
            <span>{t('native.bullBear.outcomeLabel')}: {outcome === 'bull' ? '↑' : outcome === 'bear' ? '↓' : '='}</span>
          )}
          <span>{t('native.bullBear.multiplierLabel')}: {multiplier.toFixed(2)}x</span>
        </div>
      </div>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className={`w-full rounded-2xl py-3.5 font-bold text-lg active:scale-[0.98] transition-all ${
          isWin
            ? 'bg-green-500/15 border border-green-500/30 text-green-400'
            : isDraw
            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
            : 'bg-white/10 border border-white/10 text-white/80'
        }`}
      >
        {t('native.bullBear.playAgain')}
      </button>
    </div>
  );
}
