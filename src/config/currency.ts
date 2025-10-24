/**
 * Currency configuration
 * Maps locale codes to currency codes
 */

export const LOCALE_CURRENCY_MAP: Record<string, string> = {
  'zh-CN': 'CNY',
  'zh-TW': 'TWD',
  'zh-HK': 'HKD',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'de': 'EUR',
  'de-DE': 'EUR',
  'fr': 'EUR',
  'fr-FR': 'EUR',
  'es': 'EUR',
  'es-ES': 'EUR',
  'it': 'EUR',
  'it-IT': 'EUR',
  'ja': 'JPY',
  'ja-JP': 'JPY',
  'ko': 'KRW',
  'ko-KR': 'KRW',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'en-SG': 'SGD',
};

/**
 * Default currency when locale cannot be determined
 */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Get currency code based on user's locale
 * @param locale - Locale string (e.g., 'zh-CN', 'en-US', 'zh-TW')
 * @returns Currency code (e.g., 'CNY', 'USD', 'TWD')
 */
export function getCurrencyFromLocale(locale?: string): string {
  try {
    // 如果传入了 locale，优先使用；否则尝试从浏览器获取
    let userLocale = locale;
    if (!userLocale && typeof navigator !== 'undefined') {
      userLocale = navigator.language || 'en-US';
    }
    if (!userLocale) {
      userLocale = 'en-US';
    }

    console.log('Getting currency for locale:', userLocale);

    // Check exact match first
    if (LOCALE_CURRENCY_MAP[userLocale]) {
      return LOCALE_CURRENCY_MAP[userLocale];
    }

    // Check language prefix match (e.g., 'zh' from 'zh-CN')
    const languagePrefix = userLocale.split('-')[0];
    for (const [localeKey, currency] of Object.entries(LOCALE_CURRENCY_MAP)) {
      if (localeKey.startsWith(languagePrefix)) {
        return currency;
      }
    }

    // Return default currency
    return DEFAULT_CURRENCY;
  } catch (err) {
    console.warn('Failed to detect user currency, using default:', err);
    return DEFAULT_CURRENCY;
  }
}

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  CNY: '¥',
  JPY: '¥',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  HKD: 'HK$',
  SGD: 'S$',
  TWD: 'NT$',
  KRW: '₩',
};

/**
 * Get currency symbol
 * @param currency - Currency code (e.g., 'USD', 'CNY')
 * @returns Currency symbol (e.g., '$', '¥')
 */
export function getCurrencySymbol(currency?: string): string {
  if (!currency) return '';
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
}