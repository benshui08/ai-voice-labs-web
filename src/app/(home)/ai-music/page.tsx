import type { Metadata } from 'next';
import AiMusicPageContent from '@/components/sections/seo/AiMusicPageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { AI_MUSIC_CONTENT } from '@/config/seo/ai-music';

export const metadata: Metadata = {
  title: AI_MUSIC_CONTENT.en.metadata.title,
  description: AI_MUSIC_CONTENT.en.metadata.description,
  keywords: AI_MUSIC_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'ai-music'),
    languages: buildAlternates('ai-music'),
  },
  openGraph: {
    title: AI_MUSIC_CONTENT.en.metadata.title,
    description: AI_MUSIC_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'ai-music'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
  },
};

export default function AiMusicPage() {
  return <AiMusicPageContent locale="en" />;
}
