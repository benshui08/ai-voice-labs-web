'use client';

import { useState, useRef, useEffect } from 'react';
import { useBottomNav } from '@/contexts/BottomNavContext';
import { Share } from '@capacitor/share';
import { createShareLink } from '@/actions/share';
import PlayerModalHeader from './PlayerModalHeader';

/**
 * 公开对话数据接口（用于 Explore 展示）
 */
export interface PublicDialogueData {
  id: number;
  taskId: string;
  dialogueJson: string;
  totalCharacters: number;
  duration: number | null;
  audioUrl: string | null;
  user: string;
  createdAt: string;
  speakerNames: string[];
  previewText: string;
}

interface DialoguePlayerModalProps {
  dialogue: PublicDialogueData;
  onClose: () => void;
  onRecreate?: () => void;
}

// 对话角色的颜色方案
const speakerColors = [
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', name: 'text-cyan-400' },
  { bg: 'bg-purple-500/15', border: 'border-purple-500/30', name: 'text-purple-400' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500/30', name: 'text-amber-400' },
  { bg: 'bg-green-500/15', border: 'border-green-500/30', name: 'text-green-400' },
  { bg: 'bg-rose-500/15', border: 'border-rose-500/30', name: 'text-rose-400' },
  { bg: 'bg-blue-500/15', border: 'border-blue-500/30', name: 'text-blue-400' },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function DialoguePlayerModal({
  dialogue,
  onClose,
  onRecreate,
}: DialoguePlayerModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(dialogue.duration || 0);
  const [isSharing, setIsSharing] = useState(false);
  const { hideAll, showAll } = useBottomNav();

  // 解析对话内容
  const dialogueLines: Array<{ text: string; voice: string }> = (() => {
    try {
      return JSON.parse(dialogue.dialogueJson);
    } catch {
      return [];
    }
  })();

  // 角色 -> 颜色映射
  const speakerColorMap = new Map<string, (typeof speakerColors)[0]>();
  const uniqueSpeakers = [...new Set(dialogueLines.map((d) => d.voice))];
  uniqueSpeakers.forEach((speaker, i) => {
    speakerColorMap.set(speaker, speakerColors[i % speakerColors.length]);
  });

  useEffect(() => {
    hideAll();
    return () => showAll();
  }, [hideAll, showAll]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioRef.current.currentTime = percent * duration;
    setCurrentTime(percent * duration);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await createShareLink('dialogue', dialogue.taskId);
      const speakerLabel = dialogue.speakerNames.join(' & ');
      await Share.share({
        title: 'AI Dialogue',
        text: `Check out this AI-generated dialogue: ${speakerLabel}`,
        url: result.url,
        dialogTitle: 'Share Dialogue',
      });
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a1a] flex flex-col">
      {/* 隐藏的音频元素 */}
      {dialogue.audioUrl && (
        <audio
          ref={audioRef}
          src={dialogue.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* 顶部导航 */}
      <PlayerModalHeader
        onClose={onClose}
        onShare={handleShare}
        isSharing={isSharing}
        contentType="dialogue"
        contentId={dialogue.taskId}
      />

      {/* 可滚动内容区域 - 对话列表 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 标题：角色名 */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            {dialogue.speakerNames.join(' & ')}
          </h2>
        </div>

        {/* 对话气泡列表 */}
        <div className="space-y-3">
          {dialogueLines.map((line, index) => {
            const color = speakerColorMap.get(line.voice) || speakerColors[0];
            return (
              <div key={index} className={`rounded-xl p-3 ${color.bg} border ${color.border}`}>
                <p className={`text-xs font-medium mb-1 ${color.name}`}>{line.voice}</p>
                <p className="text-gray-200 text-sm leading-relaxed">{line.text}</p>
              </div>
            );
          })}
        </div>

        {/* 创建者信息 */}
        <div className="text-center text-gray-500 text-xs mt-4">
          Created by {dialogue.user}
        </div>
      </div>

      {/* 底部播放器和操作按钮 */}
      <div
        className="flex-shrink-0 px-6 pt-4 bg-[#0a0a1a] border-t border-gray-800/50"
        style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 24px)' }}
      >
        {/* 进度条 */}
        <div
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>
        </div>

        {/* 时间显示 */}
        <div className="flex justify-between text-gray-500 text-xs mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 播放按钮 */}
        <div className="flex justify-center mb-4">
          <button
            onClick={togglePlay}
            disabled={!dialogue.audioUrl}
            className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {isPlaying ? (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Recreate 按钮 */}
        {onRecreate && (
          <button
            onClick={onRecreate}
            className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Recreate
          </button>
        )}
      </div>
    </div>
  );
}
