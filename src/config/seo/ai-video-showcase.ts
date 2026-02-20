export interface VideoSpecCard {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  specs: string[];
}

export const VIDEO_SPEC_CARDS: VideoSpecCard[] = [
  {
    id: 'resolution',
    title: 'Resolution',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    specs: ['480p', '720p'],
  },
  {
    id: 'duration',
    title: 'Duration',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    specs: ['4s', '8s', '12s'],
  },
  {
    id: 'aspect-ratio',
    title: 'Aspect Ratios',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    specs: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
  },
  {
    id: 'input',
    title: 'Input Modes',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    specs: ['Text Prompt', 'Image Guide'],
  },
  {
    id: 'audio',
    title: 'Audio',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    specs: ['AI Voiceover', 'Sound Effects'],
  },
  {
    id: 'model',
    title: 'AI Model',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    specs: ['Seedance 1.5 Pro'],
  },
];

export const VIDEO_SHOWCASE_LABELS: Record<
  string,
  { title: string; supported: string }
> = {
  en: {
    title: 'Video Generation Specs',
    supported: 'Supported Capabilities',
  },
  ja: {
    title: '動画生成スペック',
    supported: 'サポート機能',
  },
  'zh-Hant': {
    title: '影片生成規格',
    supported: '支援功能',
  },
  ko: {
    title: '영상 생성 스펙',
    supported: '지원 기능',
  },
  th: {
    title: 'สเปคการสร้างวิดีโอ',
    supported: 'ความสามารถที่รองรับ',
  },
};
