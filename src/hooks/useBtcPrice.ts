'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BINANCE_WS_URL, WS_RECONNECT_DELAY_MS, PRICE_CHART_HISTORY_SECONDS } from '@/config/native/bullBearConfig';

export interface PriceTick {
  price: number;
  time: number; // Date.now()
}

interface UseBtcPriceResult {
  price: number | null;
  priceHistory: PriceTick[];
  isConnected: boolean;
}

/**
 * Binance WebSocket hook for real-time BTC/USDT price
 *
 * - 自动重连
 * - throttle 200ms 更新 React state
 * - 保留最近 PRICE_CHART_HISTORY_SECONDS 秒的 tick
 * - 仅在组件 mount 时连接，unmount 时关闭
 */
export function useBtcPrice(): UseBtcPriceResult {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceTick[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastUpdateRef = useRef(0);
  const historyRef = useRef<PriceTick[]>([]);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    try {
      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (mountedRef.current) setIsConnected(true);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const data = JSON.parse(event.data);
          const newPrice = parseFloat(data.p);
          if (isNaN(newPrice)) return;

          const now = Date.now();
          const tick: PriceTick = { price: newPrice, time: now };

          // Update history ref (trim old ticks)
          const cutoff = now - PRICE_CHART_HISTORY_SECONDS * 1000;
          historyRef.current = [...historyRef.current.filter(t => t.time > cutoff), tick];

          // Throttle React state updates to 200ms
          if (now - lastUpdateRef.current >= 200) {
            lastUpdateRef.current = now;
            setPrice(newPrice);
            setPriceHistory([...historyRef.current]);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        if (mountedRef.current) {
          setIsConnected(false);
          reconnectTimerRef.current = setTimeout(connect, WS_RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      reconnectTimerRef.current = setTimeout(connect, WS_RECONNECT_DELAY_MS);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { price, priceHistory, isConnected };
}
