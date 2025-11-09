'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import MobileAudioPlayer from './MobileAudioPlayer';
import TextExpandModal from './TextExpandModal';
import { getStatusLabel, getStatusColor } from '@/lib/api/tts';
import type { Generation } from '@/types/tts';

interface MobileSpeechCardProps {
  generation: Generation;
  onDelete: () => void;
  onDownload: () => void;
}

export default function MobileSpeechCard({ generation, onDelete, onDownload }: MobileSpeechCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Use scrollHeight comparison with a small threshold for rounding errors
        const isTrunc = element.scrollHeight > element.clientHeight + 1;
        setIsTruncated(isTrunc);
      }
    };

    // Delay check to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkTruncation, 0);

    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [generation.text]);

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header: Timestamp, Status, Character Count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-gray-500 whitespace-nowrap">{generation.timestamp}</span>
          {generation.status && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${getStatusColor(generation.status)}`}>
              {getStatusLabel(generation.status)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded whitespace-nowrap">
            {generation.characterCount} characters
          </span>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Text Content */}
      <div className="mb-3 relative">
        <p
          ref={textRef}
          className={`text-sm text-gray-900 line-clamp-2 ${isTruncated ? 'pr-6' : ''}`}
        >
          {generation.text}
        </p>
        {isTruncated && (
          <button
            onClick={() => setIsTextExpanded(!isTextExpanded)}
            className="absolute top-0 right-0 p-0.5 text-gray-500 hover:text-gray-700 transition-colors"
            title={isTextExpanded ? "Hide full text" : "View full text"}
          >
            {isTextExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Audio Player */}
      {generation.audioUrl && (
        <MobileAudioPlayer
          audioUrl={generation.audioUrl}
          duration={generation.duration}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(!isPlaying)}
          onDownload={onDownload}
          voiceAvatar={generation.voiceAvatar}
          voiceName={generation.voiceName}
          voiceDisplayName={generation.voiceDisplayName}
        />
      )}
    </div>

      {/* Text Expand Modal */}
      <TextExpandModal
        isOpen={isTextExpanded}
        text={generation.text}
        onClose={() => setIsTextExpanded(false)}
      />
    </>
  );
}