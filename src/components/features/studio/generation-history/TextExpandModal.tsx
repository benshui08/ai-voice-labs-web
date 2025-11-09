'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TextExpandModalProps {
  isOpen: boolean;
  text: string;
  onClose: () => void;
}

export default function TextExpandModal({ isOpen, text, onClose }: TextExpandModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-h-[80vh] bg-white rounded-t-2xl lg:rounded-2xl lg:max-w-2xl lg:mx-4 animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Generated Text</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-60px)] p-4">
          <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}