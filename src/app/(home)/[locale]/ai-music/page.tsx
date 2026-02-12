import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AiMusicPageContent from '@/components/sections/seo/AiMusicPageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { AI_MUSIC_CONTENT } from '@/config/seo/ai-music';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content = AI_MUSIC_CONTENT[loc.localeCode] || AI_MUSIC_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'ai-music'),
      languages: buildAlternates('ai-music'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'ai-music'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
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
}

export default async function LocaleAiMusicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  const content = AI_MUSIC_CONTENT[loc.localeCode] || AI_MUSIC_CONTENT.en;

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
            name: 'AI Music',
            item: buildSeoUrl(slug, 'ai-music'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Music Generator',
        url: buildSeoUrl(slug, 'ai-music'),
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
      <AiMusicPageContent locale={loc.localeCode} />
    </>
  );
}
