'use client';

import MobileBottomNav from '@/components/features/studio/MobileBottomNav';

/**
 * Voices Layout
 *
 * Provides desktop/mobile specific layouts for Voices pages:
 * - Desktop: Standard content layout
 * - Mobile: Content with bottom navigation bar and appropriate padding
 */
export default function VoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ========== 桌面端布局 (lg+) ========== */}
      <div className="hidden lg:block">
        {children}
      </div>

      {/* ========== 移动端布局 (<lg) ========== */}
      <div className="lg:hidden">
        {/* Content with bottom padding to prevent overlap with BottomNav */}
        <div className="pb-20">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </>
  );
}