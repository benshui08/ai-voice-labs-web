'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, ZoomIn, X } from 'lucide-react';
import {
  IMAGE_SAMPLES,
  IMAGE_SHOWCASE_LABELS,
  type ImageSample,
} from '@/config/seo/ai-image-showcase';

const gradients = [
  'from-purple-600 to-pink-500',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-red-500',
  'from-emerald-500 to-cyan-500',
  'from-rose-500 to-purple-600',
  'from-blue-500 to-indigo-600',
];

function ImageCard({
  image,
  index,
  onPreview,
}: {
  image: ImageSample;
  index: number;
  onPreview: (image: ImageSample) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const gradient = gradients[index % gradients.length];

  return (
    <div
      onClick={() => onPreview(image)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3]">
        {!error ? (
          <>
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
            {!loaded && (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-white/40" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-10 w-10 text-white/40" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <div className="scale-75 rounded-full bg-white/20 p-3 opacity-0 backdrop-blur-sm transition-all group-hover:scale-100 group-hover:opacity-100">
            <ZoomIn className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Model badge */}
        <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
          {image.model}
        </div>

        {/* Aspect ratio badge */}
        <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
          {image.aspectRatio}
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p className="truncate text-sm font-semibold text-white">
            {image.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-white/60">
            {image.style}
          </p>
        </div>
      </div>
    </div>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: ImageSample;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full min-w-[300px] sm:min-w-[500px]">
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            className={`object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 95vw, 800px"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-white/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{image.title}</h3>
          <p className="mt-1 text-sm text-gray-400">{image.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs text-purple-300">
              {image.model}
            </span>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs text-cyan-300">
              {image.style}
            </span>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300">
              {image.aspectRatio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageShowcase({ locale }: { locale: string }) {
  const [previewImage, setPreviewImage] = useState<ImageSample | null>(null);

  const label = IMAGE_SHOWCASE_LABELS[locale] || IMAGE_SHOWCASE_LABELS.en;

  return (
    <>
      <section className="px-6 py-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-lg font-semibold text-white">{label}</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {IMAGE_SAMPLES.map((image, i) => (
              <ImageCard
                key={image.id}
                image={image}
                index={i}
                onPreview={setPreviewImage}
              />
            ))}
          </div>
        </div>
      </section>

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}
