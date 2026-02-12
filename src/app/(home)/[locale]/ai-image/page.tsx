import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AiImagePageContent from '@/components/sections/seo/AiImagePageContent';
import {
  getSeoLocaleBySlug,
  buildSeoUrl,
  buildAlternates,
} from '@/config/seo/locales';
import { AI_IMAGE_CONTENT } from '@/config/seo/ai-image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) return {};

  const content = AI_IMAGE_CONTENT[loc.localeCode] || AI_IMAGE_CONTENT.en;

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: buildSeoUrl(slug, 'ai-image'),
      languages: buildAlternates('ai-image'),
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: buildSeoUrl(slug, 'ai-image'),
      siteName: 'Voicica AI',
      locale: loc.ogLocale,
      type: 'website',
    },
  };
}

export default async function LocaleAiImagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: slug } = await params;
  const loc = getSeoLocaleBySlug(slug);
  if (!loc) notFound();

  return <AiImagePageContent locale={loc.localeCode} />;
}
