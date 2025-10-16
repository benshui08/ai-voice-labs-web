import { useState } from 'react';
import type { VoiceModel } from '@/hooks/useTTSGenerator';

interface VoiceSelectorProps {
  selectedVoice: VoiceModel | null;
  onSelect: (voice: VoiceModel) => void;
  disabled?: boolean;
}

// 模拟语音数据（后续从 API 获取）
const MOCK_VOICES: VoiceModel[] = [
  {
    id: '1',
    name: 'Elon Musk',
    description: 'Transform your educational content with our advanced AI voice generator.',
    avatar: '🧑',
    language: 'US',
    isPro: false,
  },
  {
    id: '2',
    name: 'SpongeBob SquarePants',
    description: 'Unleash infectious enthusiasm with our cutting-edge AI voice technology.',
    avatar: '🧽',
    language: 'US',
  },
  {
    id: '3',
    name: 'Donald J. Trump',
    description: 'Unlock powerful audio with our cutting-edge technology.',
    avatar: '👴',
    language: 'US',
    isPro: false,
  },
  {
    id: '4',
    name: 'Trump',
    description: 'Unleash powerful audio with our advanced generator.',
    avatar: '👨',
    language: 'US',
  },
];

/**
 * 语音选择器组件
 *
 * 显示可用的语音模型列表
 */
export default function VoiceSelector({
  selectedVoice,
  onSelect,
  disabled = false,
}: VoiceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤语音列表
  const filteredVoices = MOCK_VOICES.filter((voice) =>
    voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* 标题和语言选择 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Select a voice
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          English
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search voices"
          disabled={disabled}
          className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
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

      {/* 语音列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {filteredVoices.map((voice) => (
          <div
            key={voice.id}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              selectedVoice?.id === voice.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && onSelect(voice)}
          >
            {/* 头像 */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
              {voice.avatar}
            </div>

            {/* 信息 */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 truncate">
                  {voice.name}
                </span>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                  {voice.language}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mt-0.5">
                {voice.description}
              </p>
            </div>

            {/* 播放按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: 播放预览
                console.log('Play preview:', voice.name);
              }}
              disabled={disabled}
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}