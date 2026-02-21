/**
 * ExoClick VAST In-Stream 广告配置（Web 端激励广告）
 * https://www.exoclick.com/
 *
 * 使用 Fluid Player 播放 VAST 广告
 * 每次奖励播放多个 zone（ad pod），确保收益覆盖积分成本
 *
 * Zone 1: Voicica_Web_Mining_Node_01 (5856858)
 * Zone 2: Voicica_Web_Mining_Node_02 (5856872)
 */

export interface ExoClickConfig {
  /** VAST Zone ID 列表（按顺序播放） */
  zoneIds: string[];
  /** 是否启用 */
  enabled: boolean;
  /** VAST tag 基础 URL */
  vastBaseUrl: string;
}

/**
 * 开发环境配置
 */
const devConfig: ExoClickConfig = {
  zoneIds: ['2366423', '2366423'], // ExoClick 测试 zone × 2
  enabled: true,
  vastBaseUrl: 'https://s.magsrv.com/v1/vast.php',
};

/**
 * 生产环境配置
 */
const prodConfig: ExoClickConfig = {
  zoneIds: [
    '5856858', // Voicica_Web_Mining_Node_01
    '5856872', // Voicica_Web_Mining_Node_02
  ],
  enabled: true,
  vastBaseUrl: 'https://s.magsrv.com/v1/vast.php',
};

// 根据环境选择配置
const isProduction = process.env.NODE_ENV === 'production';
export const exoclickConfig: ExoClickConfig = isProduction ? prodConfig : devConfig;

/**
 * 获取所有 VAST tag URL 列表
 */
export function getExoClickVastUrls(): string[] {
  return exoclickConfig.zoneIds.map(
    (id) => `${exoclickConfig.vastBaseUrl}?idzone=${id}`
  );
}

/**
 * 获取单个 VAST tag URL（兼容旧调用）
 */
export function getExoClickVastUrl(): string {
  return `${exoclickConfig.vastBaseUrl}?idzone=${exoclickConfig.zoneIds[0]}`;
}

/**
 * 检查 ExoClick 是否启用
 */
export function isExoClickEnabled(): boolean {
  return exoclickConfig.enabled;
}
