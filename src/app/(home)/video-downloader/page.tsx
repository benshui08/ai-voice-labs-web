import type { Metadata } from 'next';
import VideoDownloaderPageContent from '@/components/sections/seo/VideoDownloaderPageContent';
import { buildSeoUrl, buildAlternates } from '@/config/seo/locales';
import { VIDEO_DOWNLOADER_CONTENT } from '@/config/seo/video-downloader';

export const metadata: Metadata = {
  title: VIDEO_DOWNLOADER_CONTENT.en.metadata.title,
  description: VIDEO_DOWNLOADER_CONTENT.en.metadata.description,
  keywords: VIDEO_DOWNLOADER_CONTENT.en.metadata.keywords,
  alternates: {
    canonical: buildSeoUrl('', 'video-downloader'),
    languages: buildAlternates('video-downloader'),
  },
  openGraph: {
    title: VIDEO_DOWNLOADER_CONTENT.en.metadata.title,
    description: VIDEO_DOWNLOADER_CONTENT.en.metadata.description,
    url: buildSeoUrl('', 'video-downloader'),
    siteName: 'Voicica AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://voicica.ai/og/og-video-downloader.png',
        width: 1200,
        height: 630,
        alt: 'Voicica Video Downloader',
      },
    ],
  },
};

export default function VideoDownloaderPage() {
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
            name: 'Video Downloader',
            item: buildSeoUrl('', 'video-downloader'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica Video Downloader',
        url: buildSeoUrl('', 'video-downloader'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: VIDEO_DOWNLOADER_CONTENT.en.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoDownloaderPageContent locale="en" />
    </>
  );
}
