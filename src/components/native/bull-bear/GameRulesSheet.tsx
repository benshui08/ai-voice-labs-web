'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface GameRulesSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameRulesSheet({ isOpen, onClose }: GameRulesSheetProps) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="mx-auto max-w-[430px] rounded-t-2xl bg-slate-900 border-t border-white/10 max-h-[70vh] flex flex-col">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          <h2 className="text-lg font-bold text-white px-5 pb-3">{t('native.bullBear.rulesTitle')}</h2>

          <div className="flex-1 overflow-y-auto px-5">
            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-1">{t('native.bullBear.rulesHowToPlay')}</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t('native.bullBear.rulesStep1')}</li>
                  <li>{t('native.bullBear.rulesStep2')}</li>
                  <li>{t('native.bullBear.rulesStep3')}</li>
                  <li>{t('native.bullBear.rulesStep4')}</li>
                </ol>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">{t('native.bullBear.rulesWinnings')}</h3>
                <p>{t('native.bullBear.rulesPayoutFormula')}</p>
                <p className="text-white/40 text-xs mt-1">{t('native.bullBear.rulesPayoutExample')}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">{t('native.bullBear.rulesDraw')}</h3>
                <p>{t('native.bullBear.rulesDrawNote')}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">{t('native.bullBear.rulesLimits')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('native.bullBear.rulesLimit1')}</li>
                  <li>{t('native.bullBear.rulesLimit2')}</li>
                  <li>{t('native.bullBear.rulesLimit3')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="px-5 pt-3 pb-8">
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-white/10 py-3 text-white font-medium text-sm hover:bg-white/15 transition"
            >
              {t('native.bullBear.gotIt')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
