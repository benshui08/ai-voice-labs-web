import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AiVoicePageContent from '@/components/sections/seo/AiVoicePageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { AI_VOICE_CONTENT } from '@/config/seo/ai-voice';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content = AI_VOICE_CONTENT[loc.localeCode] || AI_VOICE_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'ai-voice'),
      languages: buildAlternates('ai-voice'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'ai-voice'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
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
}

export default async function LocaleAiVoicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  const content = AI_VOICE_CONTENT[loc.localeCode] || AI_VOICE_CONTENT.en;

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
            name: 'AI Voice',
            item: buildSeoUrl(slug, 'ai-voice'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Voice Generator',
        url: buildSeoUrl(slug, 'ai-voice'),
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
      <AiVoicePageContent locale={loc.localeCode} />
    </>
  );
}
