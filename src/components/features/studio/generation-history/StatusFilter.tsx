'use client';

import { useState, useRef, useEffect } from 'react';
import { TaskStatus } from '@/types/tts';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

interface StatusFilterProps {
  selectedStatus: TaskStatus | null;
  onStatusChange: (status: TaskStatus | null) => void;
}

export default function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses: Array<{ value: TaskStatus | null; label: string }> = [
    { value: null, label: t('generationHistory.filters.allStatus') || 'All Status' },
    { value: TaskStatus.SUCCESS, label: t('generationHistory.filters.success') || 'Success' },
    { value: TaskStatus.PROCESSING, label: t('generationHistory.filters.processing') || 'Processing' },
    { value: TaskStatus.PENDING, label: t('generationHistory.filters.pending') || 'Pending' },
    { value: TaskStatus.FAILURE, label: t('generationHistory.filters.failed') || 'Failed' },
  ];

  const selectedLabel = statuses.find(s => s.value === selectedStatus)?.label || statuses[0].label;

  const handleSelect = (value: TaskStatus | null) => {
    onStatusChange(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {statuses.map((status) => (
            <button
              key={status.value || 'all'}
              type="button"
              onClick={() => handleSelect(status.value)}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors ${
                selectedStatus === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}