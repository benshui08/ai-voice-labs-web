'use client';

import type { ImageToolRecord } from '@/actions/image-tools';

interface ImageToolCardProps {
  record: ImageToolRecord;
  onClick: () => void;
}

export default function ImageToolCard({ record, onClick }: ImageToolCardProps) {
  const isProcessing = record.status === 'PENDING' || record.status === 'PROCESSING';
  const isSuccess = record.status === 'SUCCESS';
  const thumbUrl = record.resultImageUrl || record.originalImageUrl;
  const label = record.toolType === 'bg-remove' ? 'BG Remove' : 'HD Upscale';

  return (
    <div
      onClick={isSuccess ? onClick : undefined}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
        isSuccess ? 'bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer' : 'bg-gray-800/30'
      }`}
    >
      {/* 缩略图 */}
      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isProcessing ? 'Processing...' : isSuccess ? 'Completed' : 'Failed'}
        </p>
      </div>

      {isProcessing && (
        <div className="flex-shrink-0">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
