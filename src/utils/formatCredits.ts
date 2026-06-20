/**
 * 格式化积分显示：截断小数点（向下取整），不四舍五入
 *
 * 示例：
 *   formatCredits(1000)              → "1,000"
 *   formatCredits(12844.429)         → "12,844"
 *   formatCredits(0.9)               → "0"
 */
export function formatCredits(n: number): string {
  return Math.floor(n).toLocaleString();
}
