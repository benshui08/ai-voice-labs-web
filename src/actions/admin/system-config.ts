'use server';

import { getDb } from '@/lib/db';
import { systemConfigs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface FeatureFlags {
  voice: boolean;
  dialogue: boolean;
  clone: boolean;
  music: boolean;
  image: boolean;
  'image-tools': boolean;
  video: boolean;
  'video-downloader': boolean;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  voice: true,
  dialogue: true,
  clone: true,
  music: true,
  image: true,
  'image-tools': true,
  video: true,
  'video-downloader': true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const db = await getDb();
    const row = await db.select().from(systemConfigs).where(eq(systemConfigs.key, 'feature_flags')).get();
    if (!row) return DEFAULT_FEATURE_FLAGS;
    return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(row.value) };
  } catch {
    return DEFAULT_FEATURE_FLAGS;
  }
}

export async function getAllSystemConfigs() {
  const db = await getDb();
  return db.select().from(systemConfigs).all();
}

export async function updateSystemConfig(key: string, value: unknown, description?: string) {
  const db = await getDb();
  await db.insert(systemConfigs)
    .values({ key, value: JSON.stringify(value), description })
    .onConflictDoUpdate({
      target: systemConfigs.key,
      set: { value: JSON.stringify(value), updatedAt: new Date().toISOString() },
    });
  return { success: true };
}
