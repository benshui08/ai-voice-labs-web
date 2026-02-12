export interface ImageSample {
  id: string;
  title: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  model: string;
  imageUrl: string;
}

export const IMAGE_SAMPLES: ImageSample[] = [
  {
    id: 'img1',
    title: 'Cyberpunk City',
    prompt: 'A neon-lit cyberpunk city at night with flying cars and holographic billboards',
    style: 'Sci-Fi, Cinematic',
    aspectRatio: '16:9',
    model: 'Nano Banana Pro',
    imageUrl: 'https://cdn.voicica.ai/image_samples/cyberpunk-city.jpg',
  },
  {
    id: 'img2',
    title: 'Anime Portrait',
    prompt: 'A young anime girl with silver hair and blue eyes in a cherry blossom garden',
    style: 'Anime, Illustration',
    aspectRatio: '3:4',
    model: 'Seedream 4.5',
    imageUrl: 'https://cdn.voicica.ai/image_samples/anime-portrait.jpg',
  },
  {
    id: 'img3',
    title: 'Mountain Landscape',
    prompt: 'A majestic snow-capped mountain reflected in a crystal clear alpine lake at sunset',
    style: 'Photography, Landscape',
    aspectRatio: '16:9',
    model: 'Flux.2',
    imageUrl: 'https://cdn.voicica.ai/image_samples/mountain-landscape.jpg',
  },
  {
    id: 'img4',
    title: 'Fantasy Dragon',
    prompt: 'An ancient dragon perched on a cliff overlooking a medieval kingdom at dawn',
    style: 'Fantasy, Concept Art',
    aspectRatio: '1:1',
    model: 'Nano Banana Pro',
    imageUrl: 'https://cdn.voicica.ai/image_samples/fantasy-dragon.jpg',
  },
  {
    id: 'img5',
    title: 'Product Mockup',
    prompt: 'A sleek minimalist perfume bottle on a marble surface with soft golden lighting',
    style: 'Product, Commercial',
    aspectRatio: '1:1',
    model: 'Seedream 4.5',
    imageUrl: 'https://cdn.voicica.ai/image_samples/product-mockup.jpg',
  },
  {
    id: 'img6',
    title: 'Watercolor Garden',
    prompt: 'A tranquil Japanese zen garden with koi pond painted in delicate watercolor style',
    style: 'Watercolor, Art',
    aspectRatio: '4:3',
    model: 'Flux.2',
    imageUrl: 'https://cdn.voicica.ai/image_samples/watercolor-garden.jpg',
  },
];

export const IMAGE_SHOWCASE_LABELS: Record<string, string> = {
  en: 'AI Generated Samples',
  ja: 'AI生成サンプル',
  'zh-Hant': 'AI生成樣本',
  ko: 'AI 생성 샘플',
  th: 'ตัวอย่างที่สร้างด้วย AI',
};
