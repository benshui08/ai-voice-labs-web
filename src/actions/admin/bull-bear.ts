'use server';

/**
 * Admin Bull or Bear Server Actions
 *
 * 管理配置、查看统计、浏览游戏轮次
 */

import { getDb } from '@/lib/db';
import { bullBearConfig, bullBearRounds } from '@/db/schema';
import { eq, sql, desc, count, and, like, gte, lte, type SQL } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth-admin';

// ============================================================
// Types
// ============================================================

export interface AdminBullBearConfig {
  enabled: boolean;
  minBet: number;
  maxBet: number;
  multiplier30s: number;
  multiplier60s: number;
  multiplier120s: number;
  availableDurations: string;
}

export interface AdminBullBearStats {
  totalRounds: number;
  totalBetAmount: number;
  totalProfit: number;
  houseProfit: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
}

export interface AdminBullBearRound {
  id: number;
  roundId: string;
  userId: string;
  betAmount: number;
  direction: string;
  durationSeconds: number;
  multiplier: number;
  entryPrice: number;
  settlePrice: number | null;
  outcome: string | null;
  profit: number | null;
  status: string;
  startedAt: string;
  createdAt: string;
}

// ============================================================
// Config Actions
// ============================================================

/**
 * 获取管理端配置
 */
export async function getAdminBullBearConfig(): Promise<AdminBullBearConfig> {
  await verifyAdmin();
  const db = await getDb();

  const [config] = await db.select().from(bullBearConfig).limit(1);

  if (!config) {
    return {
      enabled: false,
      minBet: 1,
      maxBet: 1000,
      multiplier30s: 1.85,
      multiplier60s: 1.90,
      multiplier120s: 1.95,
      availableDurations: '[30,60,120]',
    };
  }

  return {
    enabled: config.enabled,
    minBet: config.minBet,
    maxBet: config.maxBet,
    multiplier30s: config.multiplier30s,
    multiplier60s: config.multiplier60s,
    multiplier120s: config.multiplier120s,
    availableDurations: config.availableDurations,
  };
}

/**
 * 更新管理端配置
 */
export async function updateAdminBullBearConfig(data: AdminBullBearConfig): Promise<{ success: boolean; error?: string }> {
  await verifyAdmin();
  const db = await getDb();

  try {
    const [existing] = await db.select({ id: bullBearConfig.id }).from(bullBearConfig).limit(1);

    const values = {
      enabled: data.enabled,
      minBet: data.minBet,
      maxBet: data.maxBet,
      multiplier30s: data.multiplier30s,
      multiplier60s: data.multiplier60s,
      multiplier120s: data.multiplier120s,
      availableDurations: data.availableDurations,
    };

    if (existing) {
      await db.update(bullBearConfig).set(values).where(eq(bullBearConfig.id, existing.id));
    } else {
      await db.insert(bullBearConfig).values(values);
    }

    return { success: true };
  } catch (error) {
    console.error('[Admin BullBear] updateConfig error:', error);
    return { success: false, error: 'Failed to update config' };
  }
}

// ============================================================
// Stats Actions
// ============================================================

/**
 * 获取统计数据
 */
export async function getAdminBullBearStats(): Promise<AdminBullBearStats> {
  await verifyAdmin();
  const db = await getDb();

  const [stats] = await db.select({
    totalRounds: count(),
    totalBetAmount: sql<number>`COALESCE(SUM(${bullBearRounds.betAmount}), 0)`,
    totalProfit: sql<number>`COALESCE(SUM(${bullBearRounds.profit}), 0)`,
    winCount: sql<number>`COALESCE(SUM(CASE WHEN ${bullBearRounds.status} = 'won' THEN 1 ELSE 0 END), 0)`,
    lossCount: sql<number>`COALESCE(SUM(CASE WHEN ${bullBearRounds.status} = 'lost' THEN 1 ELSE 0 END), 0)`,
    drawCount: sql<number>`COALESCE(SUM(CASE WHEN ${bullBearRounds.status} = 'draw' THEN 1 ELSE 0 END), 0)`,
  }).from(bullBearRounds);

  return {
    totalRounds: stats?.totalRounds ?? 0,
    totalBetAmount: Number(stats?.totalBetAmount ?? 0),
    totalProfit: Number(stats?.totalProfit ?? 0),
    houseProfit: -Number(stats?.totalProfit ?? 0),
    winCount: Number(stats?.winCount ?? 0),
    lossCount: Number(stats?.lossCount ?? 0),
    drawCount: Number(stats?.drawCount ?? 0),
  };
}

// ============================================================
// Rounds Actions
// ============================================================

/**
 * 分页查看所有轮次（支持筛选）
 */
export interface BullBearRoundsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAdminBullBearRounds(query: BullBearRoundsQuery = {}): Promise<{
  rounds: AdminBullBearRound[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await verifyAdmin();
  const db = await getDb();

  const { page = 1, pageSize = 20, status, userId, startDate, endDate } = query;
  const offset = (page - 1) * pageSize;

  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(bullBearRounds.status, status));
  }
  if (userId) {
    conditions.push(like(bullBearRounds.userId, `%${userId}%`));
  }
  if (startDate) {
    conditions.push(gte(bullBearRounds.createdAt, new Date(startDate).toISOString()));
  }
  if (endDate) {
    conditions.push(lte(bullBearRounds.createdAt, new Date(endDate + 'T23:59:59.999Z').toISOString()));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [[totalResult], rounds] = await Promise.all([
    db.select({ total: count() }).from(bullBearRounds).where(whereClause),
    db.select({
      id: bullBearRounds.id,
      roundId: bullBearRounds.roundId,
      userId: bullBearRounds.userId,
      betAmount: bullBearRounds.betAmount,
      direction: bullBearRounds.direction,
      durationSeconds: bullBearRounds.durationSeconds,
      multiplier: bullBearRounds.multiplier,
      entryPrice: bullBearRounds.entryPrice,
      settlePrice: bullBearRounds.settlePrice,
      outcome: bullBearRounds.outcome,
      profit: bullBearRounds.profit,
      status: bullBearRounds.status,
      startedAt: bullBearRounds.startedAt,
      createdAt: bullBearRounds.createdAt,
    })
      .from(bullBearRounds)
      .where(whereClause)
      .orderBy(desc(bullBearRounds.createdAt))
      .limit(pageSize)
      .offset(offset),
  ]);

  const total = totalResult?.total ?? 0;

  return { rounds, total, page, pageSize };
}
