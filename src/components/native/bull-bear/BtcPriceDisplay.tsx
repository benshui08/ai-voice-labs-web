'use client';

import { useMemo } from 'react';
import type { PriceTick } from '@/hooks/useBtcPrice';

interface BtcPriceDisplayProps {
  price: number | null;
  priceHistory: PriceTick[];
  isConnected: boolean;
  entryPrice?: number;
  countdown?: number; // seconds remaining
  direction?: string; // 'bull' | 'bear'
  isPlaying: boolean;
}

/**
 * 实时 BTC 价格显示 + Mini 折线图 + 倒计时 + Entry 基准线
 */
export default function BtcPriceDisplay({
  price,
  priceHistory,
  isConnected,
  entryPrice,
  countdown,
  direction,
  isPlaying,
}: BtcPriceDisplayProps) {
  // Price change indicator
  const priceChange = useMemo(() => {
    if (!entryPrice || !price) return null;
    const diff = price - entryPrice;
    const pct = (diff / entryPrice) * 100;
    return { diff, pct, isUp: diff > 0, isDown: diff < 0 };
  }, [price, entryPrice]);

  // SVG mini chart
  const chartPath = useMemo(() => {
    if (priceHistory.length < 2) return '';
    const prices = priceHistory.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const w = 280;
    const h = 100;
    const padding = 4;

    return prices.map((p, i) => {
      const x = padding + (i / (prices.length - 1)) * (w - padding * 2);
      const y = h - padding - ((p - min) / range) * (h - padding * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [priceHistory]);

  // Entry price line Y position
  const entryLineY = useMemo(() => {
    if (!entryPrice || priceHistory.length < 2) return null;
    const prices = priceHistory.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const h = 100;
    const padding = 4;
    return h - padding - ((entryPrice - min) / range) * (h - padding * 2);
  }, [entryPrice, priceHistory]);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 gap-3">
      {/* Connection indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <span className="text-[10px] text-white/30 uppercase tracking-wider">BTC/USDT</span>
      </div>

      {/* Price */}
      <div className="text-center">
        <div className={`text-4xl font-black tabular-nums ${
          !isPlaying ? 'text-white' :
          priceChange?.isUp ? 'text-green-400' :
          priceChange?.isDown ? 'text-red-400' :
          'text-white'
        }`}>
          {price ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...'}
        </div>
        {isPlaying && priceChange && (
          <div className={`text-sm font-semibold mt-1 ${priceChange.isUp ? 'text-green-400' : priceChange.isDown ? 'text-red-400' : 'text-white/40'}`}>
            {priceChange.diff >= 0 ? '+' : ''}{priceChange.diff.toFixed(2)} ({priceChange.pct >= 0 ? '+' : ''}{priceChange.pct.toFixed(4)}%)
          </div>
        )}
      </div>

      {/* Mini Chart */}
      {priceHistory.length >= 2 && (
        <div className="w-full max-w-[280px] h-[100px] relative">
          <svg width="280" height="100" viewBox="0 0 280 100" className="w-full h-full">
            {/* Chart line */}
            <path
              d={chartPath}
              fill="none"
              stroke={priceChange?.isUp ? '#4ade80' : priceChange?.isDown ? '#f87171' : '#a78bfa'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Entry price line */}
            {isPlaying && entryLineY != null && (
              <line
                x1="0" y1={entryLineY}
                x2="280" y2={entryLineY}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            )}
          </svg>
        </div>
      )}

      {/* Countdown + Direction indicator during play */}
      {isPlaying && countdown != null && (
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
            direction === 'bull' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {direction === 'bull' ? '↑ BULL' : '↓ BEAR'}
          </span>
          <span className="text-2xl font-black text-white tabular-nums">
            {countdown}s
          </span>
        </div>
      )}
    </div>
  );
}
