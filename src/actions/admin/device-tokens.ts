'use server';

/**
 * 设备令牌管理 Server Actions
 */
import { getDb } from '@/lib/db';
import { deviceTokens, users } from '@/db/schema';
import { like, desc, count, eq, and, or, sql } from 'drizzle-orm';
import { verifyAdminWithoutDb } from '@/lib/auth-admin';

interface DeviceTokensQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  platform?: string;
}

export interface AdminDeviceTokenItem {
  id: number;
  userId: string;
  token: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  userEmail: string | null;
  userName: string | null;
}

/**
 * 获取设备令牌列表
 */
export async function getAdminDeviceTokens(query: DeviceTokensQuery = {}) {
  const db = await getDb();
  await verifyAdminWithoutDb();

  const {
    page = 1,
    pageSize = 20,
    search,
    platform,
  } = query;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(deviceTokens.userId, `%${search}%`),
        like(deviceTokens.token, `%${search}%`),
      ),
    );
  }

  if (platform) {
    conditions.push(eq(deviceTokens.platform, platform));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [[{ total }], records] = await Promise.all([
    db.select({ total: count() }).from(deviceTokens).where(whereClause),
    db.select({
      id: deviceTokens.id,
      userId: deviceTokens.userId,
      token: deviceTokens.token,
      platform: deviceTokens.platform,
      createdAt: deviceTokens.createdAt,
      updatedAt: deviceTokens.updatedAt,
      userEmail: users.email,
      userName: users.name,
    })
      .from(deviceTokens)
      .leftJoin(users, eq(deviceTokens.userId, users.userId))
      .where(whereClause)
      .orderBy(desc(deviceTokens.updatedAt))
      .offset((page - 1) * pageSize)
      .limit(pageSize),
  ]);

  const items: AdminDeviceTokenItem[] = records.map((r) => ({
    id: r.id,
    userId: r.userId,
    token: r.token,
    platform: r.platform,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    userEmail: r.userEmail,
    userName: r.userName,
  }));

  return {
    items,
    total: Number(total),
    page,
    pageSize,
    totalPages: Math.ceil(Number(total) / pageSize),
  };
}

/**
 * 获取设备令牌统计
 */
export async function getDeviceTokenStats() {
  const db = await getDb();
  await verifyAdminWithoutDb();

  const [[{ total }], platformStats, [{ uniqueUsers }]] = await Promise.all([
    db.select({ total: count() }).from(deviceTokens),
    db.select({
      platform: deviceTokens.platform,
      count: count(),
    }).from(deviceTokens).groupBy(deviceTokens.platform),
    db.select({
      uniqueUsers: sql<number>`COUNT(DISTINCT ${deviceTokens.userId})`,
    }).from(deviceTokens),
  ]);

  return {
    total: Number(total),
    uniqueUsers: Number(uniqueUsers),
    platforms: platformStats.map((p) => ({
      platform: p.platform,
      count: Number(p.count),
    })),
  };
}

/**
 * 删除设备令牌
 */
export async function deleteDeviceToken(id: number) {
  const db = await getDb();
  await verifyAdminWithoutDb();

  await db.delete(deviceTokens).where(eq(deviceTokens.id, id));
  return { success: true };
}
