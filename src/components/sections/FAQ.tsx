'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAQ_ITEMS } from '@/config/faqConfig';
import { ChevronDown, Minus } from 'lucide-react';

/**
 * FAQ Section Component
 *
 * Dark-themed FAQ section with accordion-style questions
 */
export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-gray-400 text-lg">
            {t('faq.description')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden transition-all hover:border-purple-500/50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-purple-400 font-bold text-lg flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className={`font-medium text-base md:text-lg transition-colors ${
                    openIndex === index ? 'text-purple-400' : 'text-white group-hover:text-purple-300'
                  }`}>
                    {t(item.questionKey)}
                  </span>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Minus className="w-5 h-5 text-purple-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                  )}
                </div>
              </button>

              {/* Answer with smooth animation */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pl-16 md:pl-20">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {t(item.answerKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}