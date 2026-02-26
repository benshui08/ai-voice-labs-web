/**
 * 格式化积分显示：整数不带小数点，有小数则显示到有效位（最多4位）
 *
 * 示例：
 *   formatCredits(1000)      → "1,000"
 *   formatCredits(1000.5)    → "1,000.5"
 *   formatCredits(0.06)      → "0.06"
 *   formatCredits(1000.1234) → "1,000.1234"
 *   formatCredits(1000.1000) → "1,000.1"
 */
export function formatCredits(n: number): string {
  if (Number.isInteger(n)) {
    return n.toLocaleString();
  }
  // 最多保留4位小数，去掉末尾的0
  const fixed = n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  // 分离整数部分和小数部分
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = Number(intPart).toLocaleString();
  return decPart ? `${formattedInt}.${decPart}` : formattedInt;
}
