'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function StudioHomePage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t('studio.menu.home') || 'Home'}
        </h2>
      </div>

      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-xl p-8 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-2">
            Welcome to Studio 🎨
          </h3>
          <p className="text-purple-100 text-lg">
            Choose a tool to start creating amazing content
          </p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Link
          href="/studio/tts"
          className="group p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {t('studio.menu.textToSpeech') || 'Text to Speech'}
              </h4>
              <p className="text-sm text-gray-600">
                Convert text to natural-sounding speech with advanced AI voices
              </p>
            </div>
          </div>
        </Link>

        {/* Placeholder for future features */}
        <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center min-h-[120px]">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">More tools coming soon</p>
        </div>
      </div>
    </div>
  );
}