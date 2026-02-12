import type { Metadata } from 'next';
import AiVoicePageContent from '@/components/sections/seo/AiVoicePageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { AI_VOICE_CONTENT } from '@/config/seo/ai-voice';

export const metadata: Metadata = {
  title: AI_VOICE_CONTENT.en.metadata.title,
  description: AI_VOICE_CONTENT.en.metadata.description,
  keywords: AI_VOICE_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'ai-voice'),
    languages: buildAlternates('ai-voice'),
  },
  openGraph: {
    title: AI_VOICE_CONTENT.en.metadata.title,
    description: AI_VOICE_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'ai-voice'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicica.ai/og/og-ai-voice.png',
        width: 1200,
        height: 630,
        alt: 'Voicica AI Voice Generator',
      },
    ],
  },
};

export default function AiVoicePage() {
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
            name: 'AI Voice',
            item: buildSeoUrl('', 'ai-voice'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Voice Generator',
        url: buildSeoUrl('', 'ai-voice'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: AI_VOICE_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiVoicePageContent locale="en" />
    </>
  );
}
