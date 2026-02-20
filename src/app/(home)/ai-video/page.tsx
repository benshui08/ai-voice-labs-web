import type { Metadata } from 'next';
import AiVideoPageContent from '@/components/sections/seo/AiVideoPageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { AI_VIDEO_CONTENT } from '@/config/seo/ai-video';

export const metadata: Metadata = {
  title: AI_VIDEO_CONTENT.en.metadata.title,
  description: AI_VIDEO_CONTENT.en.metadata.description,
  keywords: AI_VIDEO_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'ai-video'),
    languages: buildAlternates('ai-video'),
  },
  openGraph: {
    title: AI_VIDEO_CONTENT.en.metadata.title,
    description: AI_VIDEO_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'ai-video'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicica.ai/og/og-ai-video.png',
        width: 1200,
        height: 630,
        alt: 'Voicica AI Video Generator',
      },
    ],
  },
};

export default function AiVideoPage() {
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
            name: 'AI Video',
            item: buildSeoUrl('', 'ai-video'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Video Generator',
        url: buildSeoUrl('', 'ai-video'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: AI_VIDEO_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiVideoPageContent locale="en" />
    </>
  );
}
