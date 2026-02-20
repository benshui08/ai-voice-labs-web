import {
  VIDEO_SPEC_CARDS,
  VIDEO_SHOWCASE_LABELS,
} from '@/config/seo/ai-video-showcase';

function SpecCard({
  card,
}: {
  card: (typeof VIDEO_SPEC_CARDS)[number];
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors hover:bg-white/5 ${card.bgColor}`}
    >
      <p className={`mb-2 text-sm font-semibold ${card.color}`}>
        {card.title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {card.specs.map((spec) => (
          <span
            key={spec}
            className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-gray-400"
          >
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AiVideoShowcase({ locale }: { locale: string }) {
  const labels = VIDEO_SHOWCASE_LABELS[locale] || VIDEO_SHOWCASE_LABELS.en;

  return (
    <section className="px-6 py-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium text-gray-400">
          {labels.supported}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {VIDEO_SPEC_CARDS.map((card) => (
            <SpecCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
