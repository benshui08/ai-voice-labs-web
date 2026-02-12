import type { Metadata } from 'next';
import AiImagePageContent from '@/components/sections/seo/AiImagePageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { AI_IMAGE_CONTENT } from '@/config/seo/ai-image';

export const metadata: Metadata = {
  title: AI_IMAGE_CONTENT.en.metadata.title,
  description: AI_IMAGE_CONTENT.en.metadata.description,
  keywords: AI_IMAGE_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'ai-image'),
    languages: buildAlternates('ai-image'),
  },
  openGraph: {
    title: AI_IMAGE_CONTENT.en.metadata.title,
    description: AI_IMAGE_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'ai-image'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
  },
};

export default function AiImagePage() {
  return <AiImagePageContent locale="en" />;
}
