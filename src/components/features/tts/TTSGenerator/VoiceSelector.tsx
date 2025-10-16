import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { VoiceModel } from '@/hooks/useTTSGenerator';
import { voiceAPI, enumsAPI } from '@/services/api';

interface VoiceSelectorProps {
  selectedVoice: VoiceModel | null;
  onSelect: (voice: VoiceModel) => void;
  disabled?: boolean;
}

/**
 * 语音选择器组件
 *
 * 显示可用的语音模型列表，从后端 API 获取数据
 */
export default function VoiceSelector({
  selectedVoice,
  onSelect,
  disabled = false,
}: VoiceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [voices, setVoices] = useState<VoiceModel[]>([]);
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // 从 API 获取语音列表和国家列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取语音列表和国家列表
        const [voicesData, countriesData] = await Promise.all([
          voiceAPI.getVoices({ is_active: true, limit: 1000 }),
          enumsAPI.getCountries(),
        ]);

        setVoices(voicesData as VoiceModel[]);
        setCountries(countriesData);
        console.log('✅ 成功获取语音列表和国家列表:', { voicesData, countriesData });
      } catch (err) {
        const error = err as Error;
        console.error('❌ 获取数据失败:', error);
        setError('Failed to load voices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤语音列表
  const filteredVoices = voices.filter((voice) => {
    // 搜索过滤
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voice.display_name?.en?.toLowerCase().includes(searchQuery.toLowerCase());

    // 国家过滤
    const matchesCountry = selectedCountry === 'all' || voice.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-4">
      {/* 第一行：标题 */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Select a voice
        </h2>
      </div>

      {/* 第二行：国家筛选和搜索框 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 国家选择 */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            disabled={disabled || loading}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.value} - {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search voices"
            disabled={disabled || loading}
            className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors text-sm"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 语音列表 */}
      <div className="max-h-96 overflow-y-auto pr-2">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading voices...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-purple-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredVoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No voices found matching &quot;{searchQuery}&quot;
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {!loading && !error && filteredVoices.map((voice) => (
            <div
              key={voice.id}
              className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all ${
                selectedVoice?.id === voice.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !disabled && onSelect(voice)}
            >
              {/* 顶部：头像和播放按钮 */}
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  {voice.avatar_url ? (
                    <Image
                      src={voice.avatar_url}
                      alt={voice.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-white">🎤</span>
                  )}
                </div>

                {/* 播放按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const audio = new Audio(voice.voice_sample_url);
                    audio.play().catch(err => console.error('播放失败:', err));
                  }}
                  disabled={disabled || !voice.voice_sample_url}
                  className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              {/* 信息区域 */}
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {voice.display_name?.en || voice.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {voice.role} • {voice.locale}
                  </p>
                </div>

                {/* 标签 */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                    {voice.country}
                  </span>
                  {voice.gender && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      {voice.gender}
                    </span>
                  )}
                </div>

                {/* 风格列表 */}
                {voice.style_list.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {voice.style_list.slice(0, 2).map((style, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                      >
                        {style}
                      </span>
                    ))}
                    {voice.style_list.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{voice.style_list.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}