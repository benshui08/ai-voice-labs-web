/**
 * Step 1: 从 Neon PostgreSQL 导出每张表为 D1 兼容的 SQL 文件
 *
 * 用法: npx tsx scripts/export-neon-tables.ts
 * 输出: scripts/d1-migration-temp/<table_name>.sql
 */

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.production');
  process.exit(1);
}

const OUT_DIR = path.resolve(process.cwd(), 'scripts/d1-migration-temp');

const TABLES = [
  'anonymous_users', 'task_queue', 'users', 'user_subscriptions',
  'subscription_history', 'voices', 'stories', 'story_illustrations',
  'story_paragraphs', 'tts_records', 'credit_history', 'app_releases',
  'user_events', 'daily_tasks', 'ad_reward_transactions', 'rvc_voice_models',
  'cover_records', 'share_links', 'video_records', 'image_records',
  'music_records', 'dialogue_records', 'native_banners', 'video_download_records',
  'image_tool_records', 'cloned_voices', 'conversions', 'withdrawals',
  'lucky_draws', 'lucky_draw_entries', 'lucky_draw_results', 'lucky_draw_claims',
  'referral_commissions',
];

const BOOLEAN_COLUMNS: Record<string, string[]> = {
  anonymous_users: ['is_anonymous'],
  user_subscriptions: ['auto_renew', 'cancel_at_period_end'],
  voices: ['is_active'],
  tts_records: ['is_public'],
  app_releases: ['is_latest', 'is_force_update', 'is_active'],
  daily_tasks: ['checkin_done'],
  ad_reward_transactions: ['processed'],
  rvc_voice_models: ['is_builtin', 'is_active'],
  cover_records: ['is_public'],
  video_records: ['is_public'],
  image_records: ['is_public'],
  music_records: ['is_instrumental', 'is_custom_mode', 'is_public'],
  dialogue_records: ['is_public'],
  native_banners: ['is_active'],
  video_download_records: ['is_anonymous'],
  lucky_draws: ['enabled'],
};

const JSON_COLUMNS: Record<string, string[]> = {
  subscription_history: ['metadata'],
  user_events: ['data'],
  voices: ['tags', 'style_list'],
  task_queue: ['payload'],
  native_banners: ['titles', 'subtitles', 'button_texts'],
  stories: ['character_descriptions'],
  dialogue_records: ['dialogue_json'],
};

const NUMERIC_TEXT_COLUMNS: Record<string, string[]> = {
  users: ['usdt_balance'],
  conversions: ['usdt_amount', 'rate'],
  withdrawals: ['amount', 'fee', 'net_amount'],
};

function escapeSqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return Number.isNaN(value) ? 'NULL' : String(value);
  if (typeof value === 'bigint') return String(value);
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return `'${json.replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function convertRow(tableName: string, row: Record<string, unknown>): Record<string, unknown> {
  const converted = { ...row };
  for (const col of (BOOLEAN_COLUMNS[tableName] || [])) {
    if (col in converted) converted[col] = converted[col] ? 1 : 0;
  }
  for (const col of (JSON_COLUMNS[tableName] || [])) {
    if (col in converted && converted[col] !== null && typeof converted[col] === 'object') {
      converted[col] = JSON.stringify(converted[col]);
    }
  }
  for (const col of (NUMERIC_TEXT_COLUMNS[tableName] || [])) {
    if (col in converted && converted[col] !== null) converted[col] = String(converted[col]);
  }
  return converted;
}

async function main() {
  console.log('🚀 Neon → SQL 文件导出开始\n');

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const sql = neon(DATABASE_URL!);
  let totalRows = 0;

  for (const tableName of TABLES) {
    process.stdout.write(`📋 ${tableName}: `);

    try {
      const rows = (await sql.query(`SELECT * FROM ${tableName}`)) as Record<string, unknown>[];
      const count = rows.length;

      if (count === 0) {
        console.log('0 行 → 跳过');
        continue;
      }

      const convertedRows = rows.map((row) => convertRow(tableName, row));
      const columns = Object.keys(convertedRows[0]);
      const columnList = columns.join(', ');

      // 生成单个 SQL 文件，每行一条 INSERT（避免超大语句）
      const lines: string[] = [];
      for (const row of convertedRows) {
        const values = columns.map((col) => escapeSqlValue(row[col]));
        lines.push(`INSERT OR REPLACE INTO ${tableName} (${columnList}) VALUES (${values.join(', ')});`);
      }

      const filePath = path.join(OUT_DIR, `${tableName}.sql`);
      fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf-8');

      totalRows += count;
      console.log(`${count} 行 → ${tableName}.sql ✅`);
    } catch (err) {
      console.log(`❌ ${(err as Error).message}`);
    }
  }

  console.log(`\n✅ 导出完成！共 ${totalRows} 行，文件在 scripts/d1-migration-temp/`);
}

main().catch((err) => {
  console.error('❌ 导出失败:', err);
  process.exit(1);
});
