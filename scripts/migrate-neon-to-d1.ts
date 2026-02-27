/**
 * Neon PostgreSQL → Cloudflare D1 数据迁移脚本
 *
 * 用法: npx tsx scripts/migrate-neon-to-d1.ts
 *
 * 前提:
 *   1. .env.local 中已配置 DATABASE_URL (Neon)
 *   2. D1 测试库已创建并应用了 schema (scripts/d1-schema.sql)
 *   3. wrangler 已登录
 */

import { neon } from '@neondatabase/serverless';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载 .env.production
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.production');
  process.exit(1);
}

const D1_DB_NAME = 'voicica-db';
const BATCH_SIZE = 20; // D1 每次执行的行数限制（保守值，避免 SQLITE_TOOBIG）
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000; // 失败后等 3 秒重试
const BATCH_DELAY_MS = 500; // 每批之间间隔 500ms，避免频率限制
const TEMP_DIR = path.resolve(process.cwd(), 'scripts/d1-migration-temp');

// 表名列表（按依赖关系排序，被引用的表先插入）
const TABLES = [
  'anonymous_users',
  'task_queue',
  'users',
  'user_subscriptions',
  'subscription_history',
  'voices',
  'stories',
  'story_illustrations',
  'story_paragraphs',
  'tts_records',
  'credit_history',
  'app_releases',
  'user_events',
  'daily_tasks',
  'ad_reward_transactions',
  'rvc_voice_models',
  'cover_records',
  'share_links',
  'video_records',
  'image_records',
  'music_records',
  'dialogue_records',
  'native_banners',
  'video_download_records',
  'image_tool_records',
  'cloned_voices',
  'conversions',
  'withdrawals',
  'lucky_draws',
  'lucky_draw_entries',
  'lucky_draw_results',
  'lucky_draw_claims',
  'referral_commissions',
];

// PostgreSQL boolean 类型列 → SQLite INTEGER (0/1)
const BOOLEAN_COLUMNS: Record<string, string[]> = {
  anonymous_users: ['is_anonymous'],
  users: [],
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

// JSONB / JSON 列 → TEXT (JSON.stringify)
const JSON_COLUMNS: Record<string, string[]> = {
  subscription_history: ['metadata'],
  user_events: ['data'],
  voices: ['tags', 'style_list'],
  task_queue: ['payload'],
  native_banners: ['titles', 'subtitles', 'button_texts'],
  stories: ['character_descriptions'],
  dialogue_records: ['dialogue_json'],
};

// numeric(18,6) 列 → TEXT (保持精度)
const NUMERIC_TEXT_COLUMNS: Record<string, string[]> = {
  users: ['usdt_balance'],
  conversions: ['usdt_amount', 'rate'],
  withdrawals: ['amount', 'fee', 'net_amount'],
};

/**
 * 转义 SQL 字符串值
 */
function escapeSqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NULL';
    return String(value);
  }
  if (typeof value === 'bigint') {
    return String(value);
  }
  if (typeof value === 'object') {
    // JSON 对象/数组 → 序列化字符串
    const json = JSON.stringify(value);
    return `'${json.replace(/'/g, "''")}'`;
  }
  // 字符串
  const str = String(value);
  return `'${str.replace(/'/g, "''")}'`;
}

/**
 * 转换单行数据
 */
function convertRow(
  tableName: string,
  row: Record<string, unknown>
): Record<string, unknown> {
  const converted = { ...row };

  // boolean → integer
  const boolCols = BOOLEAN_COLUMNS[tableName] || [];
  for (const col of boolCols) {
    if (col in converted) {
      converted[col] = converted[col] ? 1 : 0;
    }
  }

  // json/jsonb → text
  const jsonCols = JSON_COLUMNS[tableName] || [];
  for (const col of jsonCols) {
    if (col in converted && converted[col] !== null) {
      if (typeof converted[col] === 'object') {
        converted[col] = JSON.stringify(converted[col]);
      }
      // 已经是字符串则保持
    }
  }

  // numeric(18,6) → text (保持精度)
  const numTextCols = NUMERIC_TEXT_COLUMNS[tableName] || [];
  for (const col of numTextCols) {
    if (col in converted && converted[col] !== null) {
      converted[col] = String(converted[col]);
    }
  }

  return converted;
}

/**
 * 生成 INSERT SQL 语句
 */
function generateInsertSql(
  tableName: string,
  rows: Record<string, unknown>[]
): string {
  if (rows.length === 0) return '';

  const columns = Object.keys(rows[0]);
  const columnList = columns.join(', ');

  const valueLines = rows.map((row) => {
    const values = columns.map((col) => escapeSqlValue(row[col]));
    return `(${values.join(', ')})`;
  });

  return `INSERT INTO ${tableName} (${columnList}) VALUES\n${valueLines.join(',\n')};\n`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 将 SQL 写入临时文件并用 wrangler 执行（带重试）
 */
async function executeD1Sql(sql: string, label: string): Promise<void> {
  // 确保临时目录存在
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  const filePath = path.join(TEMP_DIR, `${label}.sql`);
  fs.writeFileSync(filePath, sql, 'utf-8');
  // Windows 路径转正斜杠，避免 wrangler 读取失败
  const posixPath = filePath.replace(/\\/g, '/');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      execSync(
        `npx wrangler d1 execute ${D1_DB_NAME} --remote --file="${posixPath}"`,
        {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 120000,
        }
      );
      return; // 成功
    } catch (err: unknown) {
      const error = err as { stderr?: Buffer; stdout?: Buffer };
      const stderr = error.stderr?.toString() || '';
      if (attempt < MAX_RETRIES) {
        console.error(`  ⚠️ 第 ${attempt} 次失败，${RETRY_DELAY_MS / 1000}s 后重试...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        const stdout = error.stdout?.toString() || '';
        console.error(`  ❌ 执行失败 (${MAX_RETRIES} 次): ${label}`);
        console.error(`  stderr: ${stderr.slice(0, 500)}`);
        console.error(`  stdout: ${stdout.slice(0, 500)}`);
        throw new Error(`D1 execute failed for ${label}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Neon → D1 数据迁移开始');
  console.log(`📦 源数据库: Neon PostgreSQL`);
  console.log(`📦 目标数据库: D1 ${D1_DB_NAME}`);
  console.log('');

  // 创建临时目录
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const sql = neon(DATABASE_URL!);

  // 关闭外键检查（避免导入顺序问题）
  console.log('🔓 关闭外键检查...');
  await executeD1Sql('PRAGMA foreign_keys = OFF;', '_fk_off');

  // 清空所有表（按反向顺序删，先删有外键引用的子表）
  console.log('🗑️  清空 D1 表数据...');
  const reversedTables = [...TABLES].reverse();
  const deleteSql = reversedTables.map((t) => `DELETE FROM ${t};`).join('\n');
  await executeD1Sql(deleteSql, '_clear_all_tables');
  console.log('   ✅ 已清空所有表\n');

  const stats: { table: string; neonCount: number; d1Count: number }[] = [];

  for (const tableName of TABLES) {
    process.stdout.write(`📋 ${tableName}: `);

    try {
      // 1. 从 Neon 读取数据（使用 sql.query 支持动态表名）
      const rows = (await sql.query(`SELECT * FROM ${tableName}`)) as Record<string, unknown>[];
      const neonCount = rows.length;
      process.stdout.write(`${neonCount} 行`);

      if (neonCount === 0) {
        console.log(' → 跳过（空表）');
        stats.push({ table: tableName, neonCount: 0, d1Count: 0 });
        continue;
      }

      // 2. 转换数据
      const convertedRows = rows.map((row) => convertRow(tableName, row));

      // 3. 分批插入 D1
      let batchNum = 0;
      for (let i = 0; i < convertedRows.length; i += BATCH_SIZE) {
        const batch = convertedRows.slice(i, i + BATCH_SIZE);
        const insertSql = generateInsertSql(tableName, batch);
        await executeD1Sql(insertSql, `${tableName}_batch_${batchNum}`);
        batchNum++;
        process.stdout.write('.');
        if (BATCH_DELAY_MS > 0) await sleep(BATCH_DELAY_MS);
      }

      // 4. 验证行数
      const d1Result = execSync(
        `npx wrangler d1 execute ${D1_DB_NAME} --remote --command "SELECT COUNT(*) as count FROM ${tableName}"`,
        { cwd: process.cwd(), stdio: 'pipe', timeout: 30000 }
      ).toString();

      // 解析 count
      const countMatch = d1Result.match(/"count":\s*(\d+)/);
      const d1Count = countMatch ? parseInt(countMatch[1]) : -1;

      const match = d1Count === neonCount ? '✅' : '⚠️ MISMATCH';
      console.log(` → D1: ${d1Count} ${match}`);

      stats.push({ table: tableName, neonCount, d1Count });
    } catch (err) {
      console.log(` → ❌ 错误: ${(err as Error).message}`);
      stats.push({ table: tableName, neonCount: -1, d1Count: -1 });
    }
  }

  // 打印汇总
  console.log('\n📊 迁移汇总:');
  console.log('─'.repeat(55));
  console.log(`${'表名'.padEnd(35)} ${'Neon'.padStart(8)} ${'D1'.padStart(8)}`);
  console.log('─'.repeat(55));
  let totalNeon = 0;
  let totalD1 = 0;
  let mismatches = 0;
  for (const s of stats) {
    const match = s.neonCount === s.d1Count ? '' : ' ⚠️';
    if (s.neonCount !== s.d1Count) mismatches++;
    if (s.neonCount > 0) totalNeon += s.neonCount;
    if (s.d1Count > 0) totalD1 += s.d1Count;
    console.log(
      `${s.table.padEnd(35)} ${String(s.neonCount).padStart(8)} ${String(s.d1Count).padStart(8)}${match}`
    );
  }
  console.log('─'.repeat(55));
  console.log(`${'TOTAL'.padEnd(35)} ${String(totalNeon).padStart(8)} ${String(totalD1).padStart(8)}`);

  if (mismatches > 0) {
    console.log(`\n⚠️ ${mismatches} 张表行数不匹配，请检查！`);
  } else {
    console.log('\n✅ 全部表数据迁移成功，行数一致！');
  }

  // 清理临时文件
  console.log('\n🧹 清理临时文件...');
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log('🏁 迁移完成！');
}

main().catch((err) => {
  console.error('❌ 迁移失败:', err);
  process.exit(1);
});
