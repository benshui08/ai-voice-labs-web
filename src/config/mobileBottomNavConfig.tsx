import { Mic, Users, Copy, History } from 'lucide-react';

/**
 * Mobile Bottom Navigation Configuration
 *
 * 定义移动端底部导航的所有菜单项
 */

export interface MobileNavItemConfig {
  id: string;
  icon: React.ReactNode;
  labelKey: string; // i18n 翻译键
  href: string;
}

export const mobileBottomNavItems: MobileNavItemConfig[] = [
  {
    id: 'tts',
    icon: <Mic className="w-5 h-5" />,
    labelKey: 'studio.mobileNav.tts',
    href: '/studio/tts',
  },
  {
    id: 'voices',
    icon: <Users className="w-5 h-5" />,
    labelKey: 'studio.mobileNav.voices',
    href: '/studio/voices',
  },
  {
    id: 'clone',
    icon: <Copy className="w-5 h-5" />,
    labelKey: 'studio.mobileNav.clone',
    href: '/studio/clone',
  },
  {
    id: 'history',
    icon: <History className="w-5 h-5" />,
    labelKey: 'studio.mobileNav.history',
    href: '/studio/generation-history',
  },
];