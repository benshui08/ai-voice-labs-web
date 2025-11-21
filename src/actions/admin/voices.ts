'use server';

/**
 * 语音管理 Server Actions
 */
import { headers } from 'next/headers';
import { auth as adminAuth } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';
import { mapLocaleToOption } from '@/utils/localeMapper';

// 管理员白名单
const ADMIN_EMAILS = ['admin@ai-voice-labs.com', 'bensting19@gmail.com'];

interface LocaleStats {
  locale: string;
  localeName: string;
  apiCount: number;
  dbCount: number;
  canSync: boolean;
}

interface SyncResult {
  success: boolean;
  message: string;
  inserted?: number;
  skipped?: number;
}

interface ApiVoice {
  name: string;
  provider: string;
  locale: string;
  country: string;
  role: string;
  gender: string;
  avatar_url: string;
  voice_sample_url: string;
  voice_sample_text: string;
  tags: string[];
  style_list: string[];
  is_active: boolean;
  sort_order: number;
  display_name?: string;
}

/**
 * 验证管理员权限（不查询数据库）
 */
async function verifyAdminWithoutDb(): Promise<void> {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('未登录');
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken.email || !ADMIN_EMAILS.includes(decodedToken.email)) {
      throw new Error('无权限访问');
    }
  } catch (error) {
    console.error('❌ [Admin] 验证失败:', error);
    throw new Error('验证失败');
  }
}

/**
 * 从后端 API 获取所有语音
 */
async function fetchVoicesFromApi(): Promise<ApiVoice[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/api/v1/voices`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const voices = await response.json();

  if (!Array.isArray(voices)) {
    throw new Error('API 返回数据格式错误');
  }

  return voices;
}

/**
 * 获取所有语言区域及统计信息
 */
export async function getVoiceStatsByLocale(): Promise<LocaleStats[]> {
  await verifyAdminWithoutDb();

  try {
    // 从 API 获取所有语音
    const apiVoices = await fetchVoicesFromApi();

    // 按 locale 分组统计 API 数量
    const apiCountByLocale: Record<string, number> = {};
    for (const voice of apiVoices) {
      apiCountByLocale[voice.locale] = (apiCountByLocale[voice.locale] || 0) + 1;
    }

    // 从数据库统计每个 locale 的数量
    const dbStats = await prisma.voices.groupBy({
      by: ['locale'],
      _count: { locale: true },
    });

    const dbCountByLocale: Record<string, number> = {};
    for (const stat of dbStats) {
      dbCountByLocale[stat.locale] = stat._count.locale;
    }

    // 合并所有 locale
    const allLocales = new Set([
      ...Object.keys(apiCountByLocale),
      ...Object.keys(dbCountByLocale),
    ]);

    // 构建结果
    const result: LocaleStats[] = [];
    for (const locale of allLocales) {
      const apiCount = apiCountByLocale[locale] || 0;
      const dbCount = dbCountByLocale[locale] || 0;
      const localeOption = mapLocaleToOption(locale);

      result.push({
        locale,
        localeName: localeOption?.name || locale,
        apiCount,
        dbCount,
        canSync: apiCount > dbCount,
      });
    }

    // 按 locale 排序
    result.sort((a, b) => a.locale.localeCompare(b.locale));

    return result;
  } catch (error) {
    console.error('获取语音统计失败:', error);
    throw error;
  }
}

/**
 * 获取所有可用的 locale 列表
 */
export async function getVoiceLocales(): Promise<string[]> {
  await verifyAdminWithoutDb();

  const apiVoices = await fetchVoicesFromApi();
  const locales = new Set(apiVoices.map((v) => v.locale));
  return Array.from(locales).sort();
}

/**
 * 按 locale 同步语音（只插入，不更新）
 */
export async function syncVoicesByLocale(locale: string): Promise<SyncResult> {
  await verifyAdminWithoutDb();

  try {
    console.log(`🔄 开始同步 locale: ${locale}`);

    // 从 API 获取该 locale 的语音
    const apiVoices = await fetchVoicesFromApi();
    const localeVoices = apiVoices.filter((v) => v.locale === locale);

    if (localeVoices.length === 0) {
      return {
        success: true,
        message: `locale ${locale} 没有可同步的语音`,
        inserted: 0,
        skipped: 0,
      };
    }

    // 获取数据库中已存在的语音名称
    const existingVoices = await prisma.voices.findMany({
      where: { locale },
      select: { name: true },
    });
    const existingNames = new Set(existingVoices.map((v) => v.name));

    // 只插入不存在的语音
    let inserted = 0;
    let skipped = 0;

    for (const voice of localeVoices) {
      if (existingNames.has(voice.name)) {
        skipped++;
        continue;
      }

      await prisma.voices.create({
        data: {
          name: voice.name,
          provider: voice.provider,
          locale: voice.locale,
          country: voice.country,
          role: voice.role,
          gender: voice.gender,
          avatar_url: voice.avatar_url,
          voice_sample_url: voice.voice_sample_url,
          voice_sample_text: voice.voice_sample_text,
          tags: voice.tags || [],
          style_list: voice.style_list || [],
          is_active: voice.is_active ?? true,
          sort_order: voice.sort_order ?? 0,
          display_name: voice.display_name,
        },
      });
      inserted++;
    }

    console.log(`✅ locale ${locale} 同步完成: 插入 ${inserted}, 跳过 ${skipped}`);

    return {
      success: true,
      message: `同步完成`,
      inserted,
      skipped,
    };
  } catch (error) {
    console.error(`❌ 同步 locale ${locale} 失败:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '同步失败',
    };
  }
}