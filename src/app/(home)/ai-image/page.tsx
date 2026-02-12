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
    images: [
      {
        url: 'https://voicica.ai/og/og-ai-image.png',
        width: 1200,
        height: 630,
        alt: 'Voicica AI Image Generator',
      },
    ],
  },
};

export default function AiImagePage() {
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
            name: 'AI Image',
            item: buildSeoUrl('', 'ai-image'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Image Generator',
        url: buildSeoUrl('', 'ai-image'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: AI_IMAGE_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AiImagePageContent locale="en" />
    </>
  );
}
