import { useMemo } from 'react';
import type { VoiceModel } from '@/hooks/useTTSGenerator';
import type { SelectOption } from '@/components/ui/CustomSelect';
import { getLanguageFromLocale, getCountryFromLocale } from '../utils/localeUtils';
import { getCountryFlagComponent, sortCountriesByLanguage } from '../utils/countryUtils';

interface UseVoiceOptionsProps {
  voices: VoiceModel[];
  availableLanguages: string[];
  locale: string;
  t: (key: string) => string;
}

/**
 * 语音选项生成 Hook
 */
export function useVoiceOptions({ voices, availableLanguages, locale, t }: UseVoiceOptionsProps) {
  // 计算唯一的国家、语言和性别列表
  const { countries, languages, genders } = useMemo(() => {
    const countrySet = new Set<string>();
    const languageSet = new Set<string>();
    const genderSet = new Set<string>();

    voices.forEach((voice) => {
      const country = getCountryFromLocale(voice.locale);
      const language = getLanguageFromLocale(voice.locale);

      if (country) countrySet.add(country);
      if (language) languageSet.add(language);
      if (voice.gender) genderSet.add(voice.gender);
    });

    return {
      countries: Array.from(countrySet).sort(),
      languages: Array.from(languageSet).sort(),
      genders: Array.from(genderSet).sort(),
    };
  }, [voices]);

  // 获取国家显示名称
  const getCountryDisplayName = (countryCode: string): string => {
    const translatedName = t(`countries.${countryCode}`);
    return translatedName !== `countries.${countryCode}` ? translatedName : countryCode;
  };

  // 获取语言显示名称
  const getLanguageDisplayName = (languageCode: string): string => {
    const translatedName = t(`languages.${languageCode}`);
    return translatedName !== `languages.${languageCode}` ? translatedName : languageCode;
  };

  // 国家选项
  const countryOptions: SelectOption[] = useMemo(() => {
    const sortedCountries = sortCountriesByLanguage(countries, locale);

    return [
      { value: 'all', label: 'All Countries' },
      ...sortedCountries.map((country) => {
        const FlagComponent = getCountryFlagComponent(country);
        return {
          value: country,
          label: getCountryDisplayName(country),
          icon: FlagComponent ? <FlagComponent className="w-5 h-4" /> : undefined,
        };
      }),
    ];
  }, [countries, locale, t]);

  // 语言选项
  const languageOptions: SelectOption[] = useMemo(() => {
    const languagesToShow = availableLanguages.length > 0 ? availableLanguages : languages;

    return [
      { value: 'all', label: 'All Languages' },
      ...languagesToShow.map((lang) => ({
        value: lang,
        label: getLanguageDisplayName(lang),
      })),
    ];
  }, [availableLanguages, languages, t]);

  // 性别选项
  const genderOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'All Genders' },
      ...genders.map((gender) => ({
        value: gender,
        label: gender,
      })),
    ];
  }, [genders]);

  return {
    countries,
    languages,
    genders,
    countryOptions,
    languageOptions,
    genderOptions,
  };
}
