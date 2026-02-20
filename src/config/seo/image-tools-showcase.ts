export interface ImageToolCard {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  specs: string[];
}

export const IMAGE_TOOL_CARDS: ImageToolCard[] = [
  {
    id: 'bg-remover',
    title: 'BG Remover',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    specs: ['JPG', 'PNG', 'WebP', '≤10 MB', '1 Credit'],
  },
  {
    id: 'hd-upscaler',
    title: 'HD Upscaler',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    specs: ['JPG', 'PNG', 'WebP', '≤10 MB', '1 Credit'],
  },
];

export const IMAGE_TOOLS_SHOWCASE_LABELS: Record<
  string,
  { title: string; supported: string }
> = {
  en: {
    title: 'Available Tools',
    supported: 'Tool Capabilities',
  },
  ja: {
    title: '利用可能なツール',
    supported: 'ツール機能',
  },
  'zh-Hant': {
    title: '可用工具',
    supported: '工具功能',
  },
  ko: {
    title: '사용 가능한 도구',
    supported: '도구 기능',
  },
  th: {
    title: 'เครื่องมือที่ใช้ได้',
    supported: 'ความสามารถของเครื่องมือ',
  },
  es: {
    title: 'Herramientas Disponibles',
    supported: 'Capacidades de Herramientas',
  },
};
