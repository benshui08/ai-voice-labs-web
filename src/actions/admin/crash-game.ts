'use server';

/**
 * Admin Crash Game Server Actions
 *
 * 管理配置、查看统计、浏览游戏轮次
 */

import { getDb } from '@/lib/db';
import { crashGameConfig, crashGameRounds } from '@/db/schema';
import { eq, sql, desc, count, and, like, gte, lte, type SQL } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth-admin';

// ============================================================
// Types
// ============================================================

export interface AdminCrashConfig {
  enabled: boolean;
  minBet: number;
  maxBet: number;
  houseEdgePercent: number;
  speed: number;
  maxDurationSeconds: number;
  gracePeriodMs: number;
}

export interface AdminCrashStats {
  totalRounds: number;
  totalBetAmount: number;
  totalProfit: number;
  houseProfit: number;
  avgCrashPoint: number;
}

export interface AdminCrashRound {
  id: number;
  roundId: string;
  userId: string;
  betAmount: number;
  crashPoint: number;
  cashOutMultiplier: number | null;
  profit: number | null;
  status: string;
  speed: number;
  startedAt: string;
  createdAt: string;
}

// ============================================================
// Config Actions
// ============================================================

/**
 * 获取管理端配置
 */
export async function getAdminCrashConfig(): Promise<AdminCrashConfig> {
  await verifyAdmin();
  const db = await getDb();

  const [config] = await db.select().from(crashGameConfig).limit(1);

  if (!config) {
    return {
      enabled: false,
      minBet: 1,
      maxBet: 1000,
      houseEdgePercent: 3,
      speed: 0.00006,
      maxDurationSeconds: 120,
      gracePeriodMs: 300,
    };
  }

  return {
    enabled: config.enabled,
    minBet: config.minBet,
    maxBet: config.maxBet,
    houseEdgePercent: config.houseEdgePercent,
    speed: config.speed,
    maxDurationSeconds: config.maxDurationSeconds,
    gracePeriodMs: config.gracePeriodMs,
  };
}

/**
 * 更新管理端配置
 */
export async function updateAdminCrashConfig(data: AdminCrashConfig): Promise<{ success: boolean; error?: string }> {
  await verifyAdmin();
  const db = await getDb();

  try {
    const [existing] = await db.select({ id: crashGameConfig.id }).from(crashGameConfig).limit(1);

    if (existing) {
      await db.update(crashGameConfig)
        .set({
          enabled: data.enabled,
          minBet: data.minBet,
          maxBet: data.maxBet,
          houseEdgePercent: data.houseEdgePercent,
          speed: data.speed,
          maxDurationSeconds: data.maxDurationSeconds,
          gracePeriodMs: data.gracePeriodMs,
        })
        .where(eq(crashGameConfig.id, existing.id));
    } else {
      await db.insert(crashGameConfig).values({
        enabled: data.enabled,
        minBet: data.minBet,
        maxBet: data.maxBet,
        houseEdgePercent: data.houseEdgePercent,
        speed: data.speed,
        maxDurationSeconds: data.maxDurationSeconds,
        gracePeriodMs: data.gracePeriodMs,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('[Admin CrashGame] updateConfig error:', error);
    return { success: false, error: 'Failed to update config' };
  }
}

// ============================================================
// Stats Actions
// ============================================================

/**
 * 获取统计数据
 */
export async function getAdminCrashStats(): Promise<AdminCrashStats> {
  await verifyAdmin();
  const db = await getDb();

  const [stats] = await db.select({
    totalRounds: count(),
    totalBetAmount: sql<number>`COALESCE(SUM(${crashGameRounds.betAmount}), 0)`,
    totalProfit: sql<number>`COALESCE(SUM(${crashGameRounds.profit}), 0)`,
    avgCrashPoint: sql<number>`COALESCE(AVG(${crashGameRounds.crashPoint}), 0)`,
  }).from(crashGameRounds);

  return {
    totalRounds: stats?.totalRounds ?? 0,
    totalBetAmount: Number(stats?.totalBetAmount ?? 0),
    totalProfit: Number(stats?.totalProfit ?? 0),
    // House profit is negative of player profit
    houseProfit: -Number(stats?.totalProfit ?? 0),
    avgCrashPoint: Math.round(Number(stats?.avgCrashPoint ?? 0) * 100) / 100,
  };
}

// ============================================================
// Rounds Actions
// ============================================================

/**
 * 分页查看所有轮次（支持筛选）
 */
export interface CrashRoundsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAdminCrashRounds(query: CrashRoundsQuery = {}): Promise<{
  rounds: AdminCrashRound[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await verifyAdmin();
  const db = await getDb();

  const { page = 1, pageSize = 20, status, userId, startDate, endDate } = query;
  const offset = (page - 1) * pageSize;

  // Build WHERE conditions
  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(crashGameRounds.status, status));
  }
  if (userId) {
    conditions.push(like(crashGameRounds.userId, `%${userId}%`));
  }
  if (startDate) {
    conditions.push(gte(crashGameRounds.createdAt, new Date(startDate).toISOString()));
  }
  if (endDate) {
    conditions.push(lte(crashGameRounds.createdAt, new Date(endDate + 'T23:59:59.999Z').toISOString()));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [[totalResult], rounds] = await Promise.all([
    db.select({ total: count() }).from(crashGameRounds).where(whereClause),
    db.select({
      id: crashGameRounds.id,
      roundId: crashGameRounds.roundId,
      userId: crashGameRounds.userId,
      betAmount: crashGameRounds.betAmount,
      crashPoint: crashGameRounds.crashPoint,
      cashOutMultiplier: crashGameRounds.cashOutMultiplier,
      profit: crashGameRounds.profit,
      status: crashGameRounds.status,
      speed: crashGameRounds.speed,
      startedAt: crashGameRounds.startedAt,
      createdAt: crashGameRounds.createdAt,
    })
      .from(crashGameRounds)
      .where(whereClause)
      .orderBy(desc(crashGameRounds.createdAt))
      .limit(pageSize)
      .offset(offset),
  ]);

  const total = totalResult?.total ?? 0;

  return { rounds, total, page, pageSize };
}
