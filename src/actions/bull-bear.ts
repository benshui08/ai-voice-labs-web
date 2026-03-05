'use server';

/**
 * Bull or Bear Game Server Actions
 *
 * 核心游戏逻辑：开始回合、结算、恢复活跃回合、历史记录
 * 用户预测 BTC 短期涨跌方向，猜对赢取可配置倍率的 $VOICICA
 */

import { getDb } from '@/lib/db';
import { bullBearRounds, bullBearConfig } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-firebase';
import { deductCreditsAtomic, addCredits } from '@/lib/credits';
import { ProductType } from '@/config/productType';
import { BINANCE_TICKER_URL, DEFAULT_MULTIPLIERS } from '@/config/native/bullBearConfig';

// ============================================================
// Types
// ============================================================

export interface BullBearConfigData {
  enabled: boolean;
  minBet: number;
  maxBet: number;
  multiplier30s: number;
  multiplier60s: number;
  multiplier120s: number;
  availableDurations: number[];
}

export interface BullBearRoundData {
  roundId: string;
  betAmount: number;
  direction: string;
  durationSeconds: number;
  multiplier: number;
  entryPrice: number;
  settlePrice?: number;
  outcome?: string;
  profit?: number;
  status: string;
  startedAt: string;
  settledAt?: string;
}

export interface BullBearResult {
  success: boolean;
  data?: BullBearRoundData;
  error?: string;
}

export interface BullBearHistoryItem {
  roundId: string;
  betAmount: number;
  direction: string;
  durationSeconds: number;
  multiplier: number;
  entryPrice: number;
  settlePrice: number | null;
  outcome: string | null;
  profit: number | null;
  status: string;
  createdAt: string;
}

// ============================================================
// Helpers
// ============================================================

/** Load config from DB, fallback to defaults */
async function loadConfig() {
  const db = await getDb();
  const [config] = await db.select().from(bullBearConfig).limit(1);
  return config || {
    enabled: false,
    minBet: 1,
    maxBet: 1000,
    multiplier30s: DEFAULT_MULTIPLIERS[30],
    multiplier60s: DEFAULT_MULTIPLIERS[60],
    multiplier120s: DEFAULT_MULTIPLIERS[120],
    availableDurations: '[30,60,120]',
  };
}

/** Get multiplier for a given duration from config */
function getMultiplierForDuration(config: Awaited<ReturnType<typeof loadConfig>>, duration: number): number {
  if (duration === 30) return config.multiplier30s;
  if (duration === 60) return config.multiplier60s;
  if (duration === 120) return config.multiplier120s;
  return 1.85; // fallback
}

/** Fetch current BTC price from Binance REST API */
async function fetchBtcPrice(): Promise<number | null> {
  try {
    const res = await fetch(BINANCE_TICKER_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

// ============================================================
// Server Actions
// ============================================================

/**
 * 获取 Bull or Bear 配置
 */
export async function getBullBearConfig(): Promise<BullBearConfigData> {
  const config = await loadConfig();
  const durations: number[] = typeof config.availableDurations === 'string'
    ? JSON.parse(config.availableDurations)
    : config.availableDurations;
  return {
    enabled: config.enabled,
    minBet: config.minBet,
    maxBet: config.maxBet,
    multiplier30s: config.multiplier30s,
    multiplier60s: config.multiplier60s,
    multiplier120s: config.multiplier120s,
    availableDurations: durations,
  };
}

/**
 * 开始一轮游戏
 *
 * 1. 验证用户已登录
 * 2. 检查没有进行中的游戏
 * 3. 扣除积分
 * 4. 获取 Binance 入场价格
 * 5. 创建 round 记录
 */
export async function startBullBearRound(
  betAmount: number,
  direction: 'bull' | 'bear',
  durationSeconds: number,
): Promise<BullBearResult> {
  try {
    const user = await getCurrentUser();
    const config = await loadConfig();

    if (!config.enabled) {
      return { success: false, error: 'Game is currently disabled' };
    }

    if (betAmount < config.minBet || betAmount > config.maxBet) {
      return { success: false, error: `Bet must be between ${config.minBet} and ${config.maxBet}` };
    }

    // Validate duration
    const durations: number[] = typeof config.availableDurations === 'string'
      ? JSON.parse(config.availableDurations)
      : config.availableDurations;
    if (!durations.includes(durationSeconds)) {
      return { success: false, error: 'Invalid duration' };
    }

    if (direction !== 'bull' && direction !== 'bear') {
      return { success: false, error: 'Invalid direction' };
    }

    const db = await getDb();

    // Check for existing active round
    const [activeRound] = await db.select({ id: bullBearRounds.id })
      .from(bullBearRounds)
      .where(and(
        eq(bullBearRounds.userId, user.uid),
        eq(bullBearRounds.status, 'active')
      ))
      .limit(1);

    if (activeRound) {
      return { success: false, error: 'You already have an active game' };
    }

    // Deduct credits
    await deductCreditsAtomic(
      user.uid,
      betAmount,
      ProductType.BULL_BEAR_BET,
      false,
      `Bull or Bear bet: ${betAmount} (${direction} ${durationSeconds}s)`,
    );

    // Fetch entry price from Binance
    const entryPrice = await fetchBtcPrice();
    if (!entryPrice) {
      // Refund on failure
      await addCredits(
        user.uid,
        betAmount,
        ProductType.BULL_BEAR_WIN,
        false,
        'Bull or Bear refund: price unavailable',
      );
      return { success: false, error: 'Failed to fetch BTC price. Bet refunded.' };
    }

    const multiplier = getMultiplierForDuration(config, durationSeconds);
    const roundId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(bullBearRounds).values({
      roundId,
      userId: user.uid,
      betAmount,
      direction,
      durationSeconds,
      multiplier,
      entryPrice,
      status: 'active',
      startedAt: now,
    });

    return {
      success: true,
      data: {
        roundId,
        betAmount,
        direction,
        durationSeconds,
        multiplier,
        entryPrice,
        status: 'active',
        startedAt: now,
      },
    };
  } catch (error) {
    console.error('[BullBear] startBullBearRound error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start game';
    return { success: false, error: message };
  }
}

/**
 * 结算回合 - 倒计时到后客户端调用
 *
 * 1. 获取 Binance 结算价格
 * 2. 比对方向
 * 3. 决定输赢
 * 4. 发奖
 */
export async function settleBullBearRound(roundId: string): Promise<BullBearResult> {
  try {
    const user = await getCurrentUser();
    const db = await getDb();

    const [round] = await db.select()
      .from(bullBearRounds)
      .where(and(
        eq(bullBearRounds.roundId, roundId),
        eq(bullBearRounds.userId, user.uid),
        eq(bullBearRounds.status, 'active')
      ))
      .limit(1);

    if (!round) {
      return { success: false, error: 'No active round found' };
    }

    // Check that enough time has elapsed
    const startedAt = new Date(round.startedAt).getTime();
    const elapsed = Date.now() - startedAt;
    const requiredMs = round.durationSeconds * 1000;

    // Allow 5s grace period for network delays
    if (elapsed < requiredMs - 5000) {
      return { success: false, error: 'Round has not ended yet' };
    }

    // Fetch settle price
    const settlePrice = await fetchBtcPrice();
    if (!settlePrice) {
      // Refund on Binance failure
      const result = await db.update(bullBearRounds)
        .set({
          status: 'expired',
          profit: 0,
        })
        .where(and(
          eq(bullBearRounds.roundId, roundId),
          eq(bullBearRounds.status, 'active')
        ));

      if (result.changes === 0) {
        return { success: false, error: 'Round already settled' };
      }

      // Refund bet
      await addCredits(
        user.uid,
        round.betAmount,
        ProductType.BULL_BEAR_WIN,
        false,
        'Bull or Bear refund: settlement price unavailable',
      );

      return {
        success: true,
        data: {
          roundId: round.roundId,
          betAmount: round.betAmount,
          direction: round.direction,
          durationSeconds: round.durationSeconds,
          multiplier: round.multiplier,
          entryPrice: round.entryPrice,
          settlePrice: undefined,
          status: 'expired',
          profit: 0,
          startedAt: round.startedAt,
        },
      };
    }

    // Determine outcome
    let outcome: 'bull' | 'bear' | 'draw';
    if (settlePrice > round.entryPrice) {
      outcome = 'bull';
    } else if (settlePrice < round.entryPrice) {
      outcome = 'bear';
    } else {
      outcome = 'draw';
    }

    const now = new Date().toISOString();

    if (outcome === 'draw') {
      // Draw: refund bet
      const result = await db.update(bullBearRounds)
        .set({
          status: 'draw',
          settlePrice,
          outcome,
          profit: 0,
          settledAt: now,
        })
        .where(and(
          eq(bullBearRounds.roundId, roundId),
          eq(bullBearRounds.status, 'active')
        ));

      if (result.changes === 0) {
        return { success: false, error: 'Round already settled' };
      }

      await addCredits(
        user.uid,
        round.betAmount,
        ProductType.BULL_BEAR_WIN,
        false,
        'Bull or Bear draw: bet refunded',
      );

      return {
        success: true,
        data: {
          roundId: round.roundId,
          betAmount: round.betAmount,
          direction: round.direction,
          durationSeconds: round.durationSeconds,
          multiplier: round.multiplier,
          entryPrice: round.entryPrice,
          settlePrice,
          outcome,
          profit: 0,
          status: 'draw',
          startedAt: round.startedAt,
          settledAt: now,
        },
      };
    }

    const isWin = round.direction === outcome;

    if (isWin) {
      // WIN
      const winAmount = Math.floor(round.betAmount * round.multiplier * 100) / 100;
      const profit = winAmount - round.betAmount;

      const result = await db.update(bullBearRounds)
        .set({
          status: 'won',
          settlePrice,
          outcome,
          profit,
          settledAt: now,
        })
        .where(and(
          eq(bullBearRounds.roundId, roundId),
          eq(bullBearRounds.status, 'active')
        ));

      if (result.changes === 0) {
        return { success: false, error: 'Round already settled' };
      }

      await addCredits(
        user.uid,
        winAmount,
        ProductType.BULL_BEAR_WIN,
        false,
        `Bull or Bear win: ${round.direction} ${round.durationSeconds}s @ ${round.multiplier}x`,
      );

      return {
        success: true,
        data: {
          roundId: round.roundId,
          betAmount: round.betAmount,
          direction: round.direction,
          durationSeconds: round.durationSeconds,
          multiplier: round.multiplier,
          entryPrice: round.entryPrice,
          settlePrice,
          outcome,
          profit,
          status: 'won',
          startedAt: round.startedAt,
          settledAt: now,
        },
      };
    } else {
      // LOSE
      const result = await db.update(bullBearRounds)
        .set({
          status: 'lost',
          settlePrice,
          outcome,
          profit: -round.betAmount,
          settledAt: now,
        })
        .where(and(
          eq(bullBearRounds.roundId, roundId),
          eq(bullBearRounds.status, 'active')
        ));

      if (result.changes === 0) {
        return { success: false, error: 'Round already settled' };
      }

      return {
        success: true,
        data: {
          roundId: round.roundId,
          betAmount: round.betAmount,
          direction: round.direction,
          durationSeconds: round.durationSeconds,
          multiplier: round.multiplier,
          entryPrice: round.entryPrice,
          settlePrice,
          outcome,
          profit: -round.betAmount,
          status: 'lost',
          startedAt: round.startedAt,
          settledAt: now,
        },
      };
    }
  } catch (error) {
    console.error('[BullBear] settleBullBearRound error:', error);
    const message = error instanceof Error ? error.message : 'Failed to settle round';
    return { success: false, error: message };
  }
}

/**
 * 获取当前活跃的游戏轮次（用于页面刷新恢复）
 *
 * 如果有超时的 active round，自动标记为 expired 并退款
 */
export async function getActiveBullBearRound(): Promise<BullBearResult> {
  try {
    const user = await getCurrentUser();
    const db = await getDb();

    const [round] = await db.select()
      .from(bullBearRounds)
      .where(and(
        eq(bullBearRounds.userId, user.uid),
        eq(bullBearRounds.status, 'active')
      ))
      .limit(1);

    if (!round) {
      return { success: true }; // No active round
    }

    // Check if expired (duration + 30s grace)
    const startedAt = new Date(round.startedAt).getTime();
    const elapsed = Date.now() - startedAt;
    const maxMs = (round.durationSeconds + 30) * 1000;

    if (elapsed > maxMs) {
      // Auto-settle expired round
      const settlePrice = await fetchBtcPrice();

      if (settlePrice) {
        // Settle normally
        let outcome: 'bull' | 'bear' | 'draw';
        if (settlePrice > round.entryPrice) outcome = 'bull';
        else if (settlePrice < round.entryPrice) outcome = 'bear';
        else outcome = 'draw';

        const isWin = round.direction === outcome;
        const isDraw = outcome === 'draw';

        let status: string;
        let profit: number;

        if (isDraw) {
          status = 'draw';
          profit = 0;
          await addCredits(user.uid, round.betAmount, ProductType.BULL_BEAR_WIN, false, 'Bull or Bear draw: bet refunded');
        } else if (isWin) {
          status = 'won';
          const winAmount = Math.floor(round.betAmount * round.multiplier * 100) / 100;
          profit = winAmount - round.betAmount;
          await addCredits(user.uid, winAmount, ProductType.BULL_BEAR_WIN, false, `Bull or Bear win: auto-settled`);
        } else {
          status = 'lost';
          profit = -round.betAmount;
        }

        await db.update(bullBearRounds)
          .set({ status, settlePrice, outcome, profit, settledAt: new Date().toISOString() })
          .where(and(eq(bullBearRounds.roundId, round.roundId), eq(bullBearRounds.status, 'active')));

        return {
          success: true,
          data: {
            roundId: round.roundId,
            betAmount: round.betAmount,
            direction: round.direction,
            durationSeconds: round.durationSeconds,
            multiplier: round.multiplier,
            entryPrice: round.entryPrice,
            settlePrice,
            outcome,
            profit,
            status,
            startedAt: round.startedAt,
            settledAt: new Date().toISOString(),
          },
        };
      } else {
        // Binance unavailable, refund
        await db.update(bullBearRounds)
          .set({ status: 'expired', profit: 0 })
          .where(and(eq(bullBearRounds.roundId, round.roundId), eq(bullBearRounds.status, 'active')));
        await addCredits(user.uid, round.betAmount, ProductType.BULL_BEAR_WIN, false, 'Bull or Bear refund: expired');

        return {
          success: true,
          data: {
            roundId: round.roundId,
            betAmount: round.betAmount,
            direction: round.direction,
            durationSeconds: round.durationSeconds,
            multiplier: round.multiplier,
            entryPrice: round.entryPrice,
            status: 'expired',
            profit: 0,
            startedAt: round.startedAt,
          },
        };
      }
    }

    // Still active
    return {
      success: true,
      data: {
        roundId: round.roundId,
        betAmount: round.betAmount,
        direction: round.direction,
        durationSeconds: round.durationSeconds,
        multiplier: round.multiplier,
        entryPrice: round.entryPrice,
        status: 'active',
        startedAt: round.startedAt,
      },
    };
  } catch (error) {
    console.error('[BullBear] getActiveBullBearRound error:', error);
    return { success: false, error: 'Failed to get active round' };
  }
}

/**
 * 获取用户历史记录
 */
export async function getUserBullBearHistory(limit: number = 20, offset: number = 0): Promise<BullBearHistoryItem[]> {
  try {
    const user = await getCurrentUser();
    const db = await getDb();

    const rounds = await db.select({
      roundId: bullBearRounds.roundId,
      betAmount: bullBearRounds.betAmount,
      direction: bullBearRounds.direction,
      durationSeconds: bullBearRounds.durationSeconds,
      multiplier: bullBearRounds.multiplier,
      entryPrice: bullBearRounds.entryPrice,
      settlePrice: bullBearRounds.settlePrice,
      outcome: bullBearRounds.outcome,
      profit: bullBearRounds.profit,
      status: bullBearRounds.status,
      createdAt: bullBearRounds.createdAt,
    })
      .from(bullBearRounds)
      .where(eq(bullBearRounds.userId, user.uid))
      .orderBy(desc(bullBearRounds.createdAt))
      .limit(limit)
      .offset(offset);

    return rounds;
  } catch (error) {
    console.error('[BullBear] getUserBullBearHistory error:', error);
    return [];
  }
}
