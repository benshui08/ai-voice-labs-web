'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { QUICK_BET_AMOUNTS, AVAILABLE_DURATIONS } from '@/config/native/bullBearConfig';

interface DirectionPanelProps {
  minBet: number;
  maxBet: number;
  usableBalance: number;
  loading: boolean;
  multipliers: Record<number, number>;
  availableDurations: number[];
  onStart: (amount: number, direction: 'bull' | 'bear', duration: number) => void;
}

/**
 * 下注面板：时长选择器(带倍率) + 金额输入 + Bull/Bear 两个按钮
 */
export default function DirectionPanel({
  minBet,
  maxBet,
  usableBalance,
  loading,
  multipliers,
  availableDurations,
  onStart,
}: DirectionPanelProps) {
  const { t } = useLanguage();
  const durations = availableDurations.length > 0 ? availableDurations : [...AVAILABLE_DURATIONS];
  const [betAmount, setBetAmount] = useState<string>(String(minBet));
  const [duration, setDuration] = useState<number>(durations[0]);

  const currentAmount = Number(betAmount);
  const isValid = !isNaN(currentAmount) && currentAmount >= minBet && currentAmount <= maxBet;
  const isInsufficient = isValid && currentAmount > usableBalance;
  const canBet = !loading && isValid && !isInsufficient;

  const handleBull = () => { if (canBet) onStart(currentAmount, 'bull', duration); };
  const handleBear = () => { if (canBet) onStart(currentAmount, 'bear', duration); };

  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Duration selector */}
      <div className="flex gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`flex-1 rounded-lg py-2 text-center transition-all ${
              duration === d
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            <div className="text-sm font-semibold">{d}s</div>
            <div className="text-[10px] mt-0.5">{multipliers[d]?.toFixed(2) ?? '—'}x</div>
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 font-medium">$VOICICA</span>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min={minBet}
          max={maxBet}
          step="1"
          className="w-full rounded-xl bg-white/10 border border-white/20 pl-[5.5rem] pr-3 py-3 text-white text-lg font-semibold placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          placeholder={String(minBet)}
        />
      </div>

      {/* Quick bet buttons */}
      <div className="flex gap-2">
        {QUICK_BET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(String(amount))}
            className={`flex-1 rounded-lg py-2 text-sm transition-all ${
              currentAmount === amount
                ? 'bg-white/20 text-white font-semibold'
                : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {amount}
          </button>
        ))}
      </div>

      {/* Bull / Bear buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBull}
          disabled={!canBet}
          className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 text-white font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/40 active:scale-[0.97] transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mx-auto" />
          ) : (
            <>↑ {t('native.bullBear.bull')}</>
          )}
        </button>
        <button
          onClick={handleBear}
          disabled={!canBet}
          className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 py-3.5 text-white font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 active:scale-[0.97] transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mx-auto" />
          ) : (
            <>↓ {t('native.bullBear.bear')}</>
          )}
        </button>
      </div>

      {/* Range hint */}
      <p className="text-center text-xs text-white/40">
        {t('native.bullBear.betRange', { min: minBet, max: maxBet })}
      </p>
    </div>
  );
}
