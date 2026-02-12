import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoDownloaderPageContent from '@/components/sections/seo/VideoDownloaderPageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { VIDEO_DOWNLOADER_CONTENT } from '@/config/seo/video-downloader';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content =
    VIDEO_DOWNLOADER_CONTENT[loc.localeCode] || VIDEO_DOWNLOADER_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'video-downloader'),
      languages: buildAlternates('video-downloader'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'video-downloader'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
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
}

export default async function LocaleVideoDownloaderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  const content =
    VIDEO_DOWNLOADER_CONTENT[loc.localeCode] || VIDEO_DOWNLOADER_CONTENT.en;

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
            item: buildSeoUrl(slug),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Video Downloader',
            item: buildSeoUrl(slug, 'video-downloader'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica Video Downloader',
        url: buildSeoUrl(slug, 'video-downloader'),
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web, Android, iOS',
        inLanguage: loc.htmlLang,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: content.features.map((f) => f.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoDownloaderPageContent locale={loc.localeCode} />
    </>
  );
}
