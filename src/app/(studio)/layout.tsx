'use client';

import { useRouter } from 'next/navigation';
import StudioSidebar from '@/components/features/studio/StudioSidebar';
import StudioTopbar from '@/components/features/studio/StudioTopbar';
import { StudioProvider, useStudio } from '@/contexts/StudioContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useLanguage } from '@/contexts/LanguageContext';

function StudioLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { title } = useStudio();
  const { credits, loading: creditsLoading } = useUserCredits();

  const handleUpgradeClick = () => {
    router.push('/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Studio Topbar - 固定在最顶部 */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <StudioTopbar
          title={title}
          credits={credits}
          creditsLoading={creditsLoading}
          onUpgradeClick={handleUpgradeClick}
        />
      </div>

      {/* 下方内容区域：侧边栏 + 主内容 */}
      <div className="pt-[60px]">
        {/* 桌面端侧边栏 */}
        <div className="hidden lg:block">
          <StudioSidebar variant="desktop" />
        </div>

        {/* 移动端水平菜单 */}
        <div className="lg:hidden fixed top-[60px] left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 z-40 overflow-x-auto">
          <StudioSidebar variant="mobile" />
        </div>

        {/* 主内容区域 */}
        <main className="lg:ml-16">
          {/* 移动端需要额外的顶部间距（菜单高度） */}
          <div className="lg:hidden h-16"></div>

          {/* 页面内容 */}
          <div className="transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioProvider>
      <StudioLayoutContent>{children}</StudioLayoutContent>
    </StudioProvider>
  );
}