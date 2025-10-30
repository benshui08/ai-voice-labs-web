'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStudio } from '@/contexts/StudioContext';
import LanguageSelectorModal from '@/components/common/LanguageSelectorModal';
import VoiceTagSelector from '@/components/features/studio/voices/VoiceTagSelector';
import VoiceSearchBar from '@/components/features/studio/voices/VoiceSearchBar';
import VoiceFilters from '@/components/features/studio/voices/VoiceFilters';
import VoiceList from '@/components/features/studio/voices/VoiceList';
import { useVoices } from '@/components/features/studio/voices/hooks/useVoices';
import { getAllLocaleOptions } from '@/utils/localeMapper';
import { getLocalizedVoiceName } from '@/types/voice';
import type { LocaleOption } from '@/types/config';
import type { Voice } from '@/types/voice';

/**
 * Voices Gallery Page (Mobile-First Design)
 *
 * Features:
 * - Search bar with language selector
 * - Left panel: Voice filters and categories
 * - Right panel: Voice cards grid
 */
export default function VoicesPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const { setTitle } = useStudio();

  // Language selector modal state
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Use voices hook for all business logic
  const {
    filteredVoices,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    selectedTagId,
    setSelectedTagId,
    selectedGender,
    setSelectedGender,
    playingVoiceId,
    handlePlayVoice,
    loadMoreVoices,
  } = useVoices({ locale });

  // Handle scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (bottom && hasMore && !loading && !loadingMore) {
        void loadMoreVoices();
      }
    },
    [hasMore, loading, loadingMore, loadMoreVoices]
  );

  // Set page title
  useEffect(() => {
    setTitle('Voice Gallery');
  }, [setTitle]);

  // Get all available language options
  const availableLanguages = getAllLocaleOptions();

  const handleLanguageSelect = (language: LocaleOption) => {
    setSelectedLanguage(language);
  };

  // Handle voice selection (return to TTS page)
  const handleSelectVoice = (voice: Voice) => {
    console.log('🎯 [Voices] 选中语音:', voice.name, voice.id);
    sessionStorage.setItem('ttsPreSelectedVoice', JSON.stringify(voice));
    console.log('💾 [Voices] 已保存到 sessionStorage');
    router.push('/studio/tts');
  };

  // Helper to get localized voice name
  const getVoiceName = (voice: Voice) => getLocalizedVoiceName(voice, locale);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* ========== Search bar + Language selector ========== */}
      <VoiceSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageClick={() => setIsLanguageModalOpen(true)}
      />

      {/* Language selector modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLocale={selectedLanguage}
        availableLocales={availableLanguages}
        onSelect={handleLanguageSelect}
      />

      {/* ========== 内容区域：左侧标签 + 右侧（上部筛选器 + 下部列表）========== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧标签选择器 - 固定，自适应内容宽度 */}
        <div className="flex-shrink-0 border-r border-gray-200">
          <VoiceTagSelector
            selectedTagId={selectedTagId}
            onTagSelect={setSelectedTagId}
          />
        </div>

        {/* 右侧区域 - 占据剩余空间 */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Filters */}
          <VoiceFilters
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
          />

          {/* Voice List with Infinite Scroll */}
          <div className="flex-1 overflow-y-auto bg-gray-50" onScroll={handleScroll}>
            <div className="p-6">
              <VoiceList
                voices={filteredVoices}
                loading={loading}
                error={error}
                playingVoiceId={playingVoiceId}
                locale={locale}
                getVoiceName={getVoiceName}
                onPlayVoice={handlePlayVoice}
                onSelectVoice={handleSelectVoice}
              />

              {/* Loading more indicator */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="text-sm text-gray-500">Loading more voices...</div>
                </div>
              )}

              {/* End of list indicator */}
              {!loading && !loadingMore && !hasMore && filteredVoices.length > 0 && (
                <div className="flex justify-center py-4">
                  <div className="text-xs text-gray-400">All voices loaded ({total} total)</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}