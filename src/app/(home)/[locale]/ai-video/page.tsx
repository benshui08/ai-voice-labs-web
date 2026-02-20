import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AiVideoPageContent from '@/components/sections/seo/AiVideoPageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { AI_VIDEO_CONTENT } from '@/config/seo/ai-video';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content = AI_VIDEO_CONTENT[loc.localeCode] || AI_VIDEO_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'ai-video'),
      languages: buildAlternates('ai-video'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'ai-video'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
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
}

export default async function LocaleAiVideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  const content = AI_VIDEO_CONTENT[loc.localeCode] || AI_VIDEO_CONTENT.en;

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
            name: 'AI Video',
            item: buildSeoUrl(slug, 'ai-video'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Video Generator',
        url: buildSeoUrl(slug, 'ai-video'),
        applicationCategory: 'MultimediaApplication',
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
      <AiVideoPageContent locale={loc.localeCode} />
    </>
  );
}
