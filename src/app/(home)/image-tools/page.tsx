import type { Metadata } from 'next';
import ImageToolsPageContent from '@/components/sections/seo/ImageToolsPageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { IMAGE_TOOLS_CONTENT } from '@/config/seo/image-tools';

export const metadata: Metadata = {
  title: IMAGE_TOOLS_CONTENT.en.metadata.title,
  description: IMAGE_TOOLS_CONTENT.en.metadata.description,
  keywords: IMAGE_TOOLS_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'image-tools'),
    languages: buildAlternates('image-tools'),
  },
  openGraph: {
    title: IMAGE_TOOLS_CONTENT.en.metadata.title,
    description: IMAGE_TOOLS_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'image-tools'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicica.ai/og/og-image-tools.png',
        width: 1200,
        height: 630,
        alt: 'Voicica AI Image Tools',
      },
    ],
  },
};

export default function ImageToolsPage() {
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
            name: 'Image Tools',
            item: buildSeoUrl('', 'image-tools'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Image Tools',
        url: buildSeoUrl('', 'image-tools'),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: IMAGE_TOOLS_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageToolsPageContent locale="en" />
    </>
  );
}
