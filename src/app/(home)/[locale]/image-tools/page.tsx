import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImageToolsPageContent from '@/components/sections/seo/ImageToolsPageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { IMAGE_TOOLS_CONTENT } from '@/config/seo/image-tools';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content =
    IMAGE_TOOLS_CONTENT[loc.localeCode] || IMAGE_TOOLS_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'image-tools'),
      languages: buildAlternates('image-tools'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'image-tools'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
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
}

export default async function LocaleImageToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  const content =
    IMAGE_TOOLS_CONTENT[loc.localeCode] || IMAGE_TOOLS_CONTENT.en;

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
            name: 'Image Tools',
            item: buildSeoUrl(slug, 'image-tools'),
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Voicica AI Image Tools',
        url: buildSeoUrl(slug, 'image-tools'),
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
      <ImageToolsPageContent locale={loc.localeCode} />
    </>
  );
}
