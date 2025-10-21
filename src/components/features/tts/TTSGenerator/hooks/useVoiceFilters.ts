import { useState, useEffect, useMemo } from 'react';
import type { VoiceModel } from '@/hooks/useTTSGenerator';
import { enumsAPI } from '@/lib/api';
import { getLanguageFromLocale, getCountryFromLocale } from '../utils/localeUtils';

interface UseVoiceFiltersProps {
  voices: VoiceModel[];
  languages: string[];
}

/**
 * 语音筛选 Hook
 */
export function useVoiceFilters({ voices, languages }: UseVoiceFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // 当选择的国家改变时，获取该国家支持的语言列表
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languageList = await enumsAPI.getVoiceLanguagesByCountry(
          selectedCountry === 'all' ? undefined : selectedCountry
        );
        setAvailableLanguages(languageList);
        setSelectedLanguage('all');
        console.log(`✅ 国家 ${selectedCountry} 支持的语言:`, languageList);
      } catch (err) {
        console.error('❌ 获取语言列表失败:', err);
        setAvailableLanguages(languages || []);
      }
    };

    void fetchLanguages();
  }, [selectedCountry, languages]);

  // 过滤语音列表
  const filteredVoices = useMemo(() => {
    return voices.filter((voice) => {
      const voiceCountry = getCountryFromLocale(voice.locale);
      const voiceLanguage = getLanguageFromLocale(voice.locale);

      const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           voice.display_name?.en?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'all' || voiceCountry === selectedCountry;
      const matchesLanguage = selectedLanguage === 'all' || voiceLanguage === selectedLanguage;
      const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;

      return matchesSearch && matchesCountry && matchesLanguage && matchesGender;
    });
  }, [voices, searchQuery, selectedCountry, selectedLanguage, selectedGender]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedLanguage,
    setSelectedLanguage,
    selectedGender,
    setSelectedGender,
    availableLanguages,
    filteredVoices,
  };
}
