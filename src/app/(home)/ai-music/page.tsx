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
    images: [
      {
        url: 'https://voicica.ai/og/og-ai-music.png',
        width: 1200,
        height: 630,
        alt: 'Voicica AI Music Generator',
      },
    ],
  },
};

export default function AiMusicPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://voicica.ai',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI Music',
            item: buildSeoUrl('', 'ai-music'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Music Generator',
        url: buildSeoUrl('', 'ai-music'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: AI_MUSIC_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiMusicPageContent locale="en" />
    </>
  );
}
