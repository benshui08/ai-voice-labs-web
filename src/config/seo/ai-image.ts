export interface AiImageLocaleContent {
  hero: {
    title: string;
    subtitle: string;
  };
  features: { title: string; description: string }[];
  cta: {
    title: string;
    buttonText: string;
  };
  seoText: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const AI_IMAGE_CONTENT: Record<string, AiImageLocaleContent> = {
  en: {
    hero: {
      title: 'AI Image Generator — Create Stunning Visuals from Text',
      subtitle:
        'Describe any scene, character, or concept — AI generates beautiful images in seconds. Choose from 4 powerful models, multiple styles, and up to 4K resolution. 100% royalty-free.',
    },
    features: [
      {
        title: '4 Powerful AI Models',
        description:
          'Choose the perfect model for your needs — Z-Image for lightning-fast results, Flux.2 for balanced quality, Seedream 4.5 for diverse styles, or Nano Banana Pro for photorealistic 4K masterpieces.',
      },
      {
        title: 'Text-to-Image & Image-to-Image',
        description:
          'Generate images from text prompts, or upload a reference image for guided generation. Refine, remix, and iterate until your vision is perfect.',
      },
      {
        title: 'AI Prompt Generator',
        description:
          'Not sure how to describe your idea? Type a simple phrase and our AI Prompt Generator expands it into a detailed, optimized prompt for the best possible results.',
      },
      {
        title: 'Flexible Aspect Ratios & Quality',
        description:
          'Create images in any format — 16:9 landscapes, 9:16 stories, 1:1 squares, and more. Output in 1K, 2K, or 4K resolution depending on the model.',
      },
      {
        title: 'Every Style Imaginable',
        description:
          'Photorealistic portraits, anime illustrations, watercolor paintings, concept art, product mockups, 3D renders — the AI adapts to any artistic style you describe.',
      },
      {
        title: '100% Royalty-Free',
        description:
          'All generated images are yours to use — social media, websites, print, advertising, or commercial projects. No licensing fees, no watermarks, full ownership.',
      },
    ],
    cta: {
      title: 'Start Creating AI Images Now',
      buttonText: 'Try Free AI Image Generator',
    },
    seoText:
      'Voicica AI Image Generator transforms your ideas into stunning visuals in seconds. Whether you need social media graphics, YouTube thumbnails, concept art, product images, or creative illustrations — simply describe what you want and AI generates it. Powered by 4 state-of-the-art models including Nano Banana Pro with reasoning capabilities, Voicica supports text-to-image and image-to-image generation in resolutions up to 4K. The built-in AI Prompt Generator helps you craft perfect prompts from simple descriptions. Free credits every day — no design experience required.',
    metadata: {
      title: 'AI Image Generator — Create Images from Text | Voicica AI',
      description:
        'Generate stunning AI images from text prompts. 4 powerful models, text-to-image & image-to-image, up to 4K resolution. Free, royalty-free image creator.',
      keywords: [
        'AI image generator',
        'text to image',
        'AI art generator',
        'AI image creator',
        'free image generator',
        'AI art maker',
        'text to image AI',
        'AI illustration',
      ],
    },
  },
  ja: {
    hero: {
      title: 'AI画像ジェネレーター — テキストから美しいビジュアルを作成',
      subtitle:
        'シーン、キャラクター、コンセプトを説明するだけで、AIが数秒で美しい画像を生成。4つのパワフルなモデル、多彩なスタイル、最大4K解像度。100%ロイヤリティフリー。',
    },
    features: [
      {
        title: '4つのパワフルなAIモデル',
        description:
          '用途に最適なモデルを選択 — Z-Imageは超高速、Flux.2はバランスの取れた品質、Seedream 4.5は多彩なスタイル、Nano Banana Proはフォトリアルな4K傑作に。',
      },
      {
        title: 'テキストから画像＆画像から画像',
        description:
          'テキストプロンプトから画像を生成、または参考画像をアップロードしてガイド付き生成。ビジョンが完璧になるまで改良、リミックス、反復できます。',
      },
      {
        title: 'AIプロンプトジェネレーター',
        description:
          'アイデアの説明に困ったら？簡単なフレーズを入力すると、AIプロンプトジェネレーターが最高の結果を得るための詳細で最適化されたプロンプトに拡張します。',
      },
      {
        title: '柔軟なアスペクト比＆品質',
        description:
          'あらゆるフォーマットで画像を作成 — 16:9の横長、9:16のストーリーズ、1:1のスクエアなど。モデルに応じて1K、2K、4K解像度で出力。',
      },
      {
        title: 'あらゆるスタイルに対応',
        description:
          'フォトリアルなポートレート、アニメイラスト、水彩画、コンセプトアート、プロダクトモックアップ、3Dレンダリング — 説明するあらゆるアートスタイルにAIが適応。',
      },
      {
        title: '100%ロイヤリティフリー',
        description:
          '生成された画像はすべてあなたのもの — SNS、ウェブサイト、印刷物、広告、商用プロジェクトに使用可能。ライセンス料なし、ウォーターマークなし、完全所有。',
      },
    ],
    cta: {
      title: '今すぐAI画像を作成',
      buttonText: '無料AI画像ジェネレーターを試す',
    },
    seoText:
      'Voicica AI画像ジェネレーターは、あなたのアイデアを数秒で魅力的なビジュアルに変えます。SNSグラフィック、YouTubeサムネイル、コンセプトアート、商品画像、クリエイティブなイラストなど — 欲しいものを説明するだけでAIが生成。推論機能搭載のNano Banana Proを含む4つの最先端モデルで、テキストから画像・画像から画像の生成を最大4K解像度でサポート。内蔵のAIプロンプトジェネレーターが簡単な説明から完璧なプロンプトを作成。毎日無料クレジット — デザイン経験は不要です。',
    metadata: {
      title: 'AI画像ジェネレーター — テキストから画像作成 | Voicica AI',
      description:
        'テキストプロンプトから美しいAI画像を生成。4つのパワフルなモデル、テキストから画像＆画像から画像、最大4K解像度。無料ロイヤリティフリー画像クリエイター。',
      keywords: [
        'AI画像ジェネレーター',
        'テキストから画像',
        'AIアートジェネレーター',
        'AI画像作成',
        '無料画像生成',
        'AIアートメーカー',
        'AIイラスト',
        'AI画像生成',
      ],
    },
  },
  'zh-Hant': {
    hero: {
      title: 'AI圖片生成器 — 從文字創造驚豔視覺',
      subtitle:
        '描述任何場景、角色或概念——AI在幾秒內生成精美圖片。4種強大模型、多種風格、最高4K解析度。100%免版稅。',
    },
    features: [
      {
        title: '4種強大AI模型',
        description:
          '選擇最適合的模型——Z-Image閃電般快速，Flux.2品質均衡，Seedream 4.5風格多元，Nano Banana Pro生成擬真4K傑作。',
      },
      {
        title: '文字生圖與圖片引導',
        description:
          '從文字提示生成圖片，或上傳參考圖進行引導生成。反覆改良、重新混合，直到完美呈現你的創意。',
      },
      {
        title: 'AI提示詞生成器',
        description:
          '不知道怎麼描述？輸入簡單的短語，AI提示詞生成器會將其擴展為詳細、最佳化的提示詞，獲得最好的生成效果。',
      },
      {
        title: '靈活的長寬比與畫質',
        description:
          '以任何格式創建圖片——16:9橫幅、9:16限時動態、1:1方形等。依模型可輸出1K、2K或4K解析度。',
      },
      {
        title: '任何風格都能實現',
        description:
          '擬真肖像、動漫插畫、水彩畫、概念藝術、產品模型、3D渲染——AI適應你描述的任何藝術風格。',
      },
      {
        title: '100%免版稅',
        description:
          '所有生成的圖片都歸你所有——社群媒體、網站、印刷品、廣告或商業專案均可使用。無授權費、無浮水印、完全擁有。',
      },
    ],
    cta: {
      title: '立即開始創作AI圖片',
      buttonText: '免費試用AI圖片生成器',
    },
    seoText:
      'Voicica AI圖片生成器能在數秒內將你的想法化為驚豔的視覺作品。無論你需要社群媒體圖片、YouTube縮圖、概念藝術、產品圖片或創意插畫——只需描述你想要的，AI就能生成。搭載4種最先進的模型，包括具備推理能力的Nano Banana Pro，支援文字生圖與圖片引導生成，解析度最高達4K。內建AI提示詞生成器協助你從簡單描述創建完美提示詞。每天免費額度——無需設計經驗。',
    metadata: {
      title: 'AI圖片生成器 — 從文字創建圖片 | Voicica AI',
      description:
        '從文字提示生成精美AI圖片。4種強大模型、文字生圖與圖片引導、最高4K解析度。免費免版稅圖片創作工具。',
      keywords: [
        'AI圖片生成器',
        '文字生圖',
        'AI藝術生成器',
        'AI圖片創作',
        '免費圖片生成',
        'AI藝術創作',
        'AI插畫',
        'AI繪圖',
      ],
    },
  },
  ko: {
    hero: {
      title: 'AI 이미지 생성기 — 텍스트로 멋진 비주얼 만들기',
      subtitle:
        '장면, 캐릭터, 컨셉을 설명하면 AI가 몇 초 만에 아름다운 이미지를 생성합니다. 4개의 강력한 모델, 다양한 스타일, 최대 4K 해상도. 100% 로열티 프리.',
    },
    features: [
      {
        title: '4개의 강력한 AI 모델',
        description:
          '용도에 맞는 모델을 선택하세요 — Z-Image는 초고속, Flux.2는 균형 잡힌 품질, Seedream 4.5는 다양한 스타일, Nano Banana Pro는 포토리얼 4K 걸작에 최적.',
      },
      {
        title: '텍스트-이미지 & 이미지-이미지',
        description:
          '텍스트 프롬프트로 이미지를 생성하거나, 참조 이미지를 업로드하여 가이드 생성. 비전이 완벽해질 때까지 개선, 리믹스, 반복할 수 있습니다.',
      },
      {
        title: 'AI 프롬프트 생성기',
        description:
          '아이디어를 어떻게 설명해야 할지 모르겠나요? 간단한 문구를 입력하면 AI 프롬프트 생성기가 최상의 결과를 위한 상세하고 최적화된 프롬프트로 확장합니다.',
      },
      {
        title: '유연한 화면 비율 & 품질',
        description:
          '모든 포맷으로 이미지 생성 — 16:9 가로, 9:16 스토리, 1:1 정사각형 등. 모델에 따라 1K, 2K, 4K 해상도로 출력.',
      },
      {
        title: '모든 스타일 구현 가능',
        description:
          '포토리얼 인물, 애니메이션 일러스트, 수채화, 컨셉 아트, 제품 목업, 3D 렌더링 — 설명하는 모든 아트 스타일에 AI가 적응합니다.',
      },
      {
        title: '100% 로열티 프리',
        description:
          '생성된 모든 이미지는 당신의 것 — SNS, 웹사이트, 인쇄물, 광고, 상업 프로젝트에 사용 가능. 라이선스 비용 없음, 워터마크 없음, 완전한 소유권.',
      },
    ],
    cta: {
      title: '지금 AI 이미지 만들기 시작',
      buttonText: '무료 AI 이미지 생성기 체험',
    },
    seoText:
      'Voicica AI 이미지 생성기는 당신의 아이디어를 몇 초 만에 멋진 비주얼로 변환합니다. SNS 그래픽, YouTube 썸네일, 컨셉 아트, 제품 이미지, 크리에이티브 일러스트가 필요하든 — 원하는 것을 설명하기만 하면 AI가 생성합니다. 추론 기능을 갖춘 Nano Banana Pro를 포함한 4개의 최첨단 모델로, 텍스트-이미지 및 이미지-이미지 생성을 최대 4K 해상도로 지원합니다. 내장 AI 프롬프트 생성기가 간단한 설명에서 완벽한 프롬프트를 만들어줍니다.',
    metadata: {
      title: 'AI 이미지 생성기 — 텍스트로 이미지 만들기 | Voicica AI',
      description:
        '텍스트 프롬프트로 멋진 AI 이미지를 생성하세요. 4개의 강력한 모델, 텍스트-이미지 & 이미지-이미지, 최대 4K 해상도. 무료 로열티 프리 이미지 크리에이터.',
      keywords: [
        'AI 이미지 생성기',
        '텍스트 투 이미지',
        'AI 아트 생성기',
        'AI 이미지 만들기',
        '무료 이미지 생성',
        'AI 아트 메이커',
        'AI 일러스트',
        'AI 그림 생성',
      ],
    },
  },
  th: {
    hero: {
      title: 'AI สร้างรูปภาพ — สร้างภาพสวยจากข้อความ',
      subtitle:
        'อธิบายฉาก ตัวละคร หรือแนวคิดใดก็ได้ — AI สร้างภาพสวยงามในไม่กี่วินาที เลือกจาก 4 โมเดลทรงพลัง หลายสไตล์ ความละเอียดสูงสุด 4K ปลอดค่าลิขสิทธิ์ 100%',
    },
    features: [
      {
        title: '4 โมเดล AI ทรงพลัง',
        description:
          'เลือกโมเดลที่เหมาะกับคุณ — Z-Image เร็วสายฟ้า, Flux.2 คุณภาพสมดุล, Seedream 4.5 สไตล์หลากหลาย, Nano Banana Pro ภาพเสมือนจริง 4K',
      },
      {
        title: 'ข้อความเป็นภาพ & ภาพเป็นภาพ',
        description:
          'สร้างภาพจากข้อความ หรืออัปโหลดภาพอ้างอิงเพื่อนำทางการสร้าง ปรับปรุง รีมิกซ์ และทำซ้ำจนกว่าจะสมบูรณ์แบบ',
      },
      {
        title: 'AI สร้างพรอมต์',
        description:
          'ไม่รู้จะอธิบายอย่างไร? พิมพ์วลีง่ายๆ แล้ว AI สร้างพรอมต์จะขยายเป็นพรอมต์ที่ละเอียดและปรับแต่งแล้วเพื่อผลลัพธ์ที่ดีที่สุด',
      },
      {
        title: 'อัตราส่วนภาพ & คุณภาพยืดหยุ่น',
        description:
          'สร้างภาพในทุกรูปแบบ — แนวนอน 16:9, สตอรี่ 9:16, สี่เหลี่ยม 1:1 และอื่นๆ เอาต์พุตความละเอียด 1K, 2K หรือ 4K ตามโมเดล',
      },
      {
        title: 'ทุกสไตล์ที่นึกออก',
        description:
          'ภาพเหมือนจริง ภาพวาดอนิเมะ สีน้ำ คอนเซปต์อาร์ต ม็อคอัพผลิตภัณฑ์ เรนเดอร์ 3D — AI ปรับตัวตามทุกสไตล์ศิลปะที่คุณอธิบาย',
      },
      {
        title: 'ปลอดค่าลิขสิทธิ์ 100%',
        description:
          'ภาพที่สร้างทั้งหมดเป็นของคุณ — โซเชียลมีเดีย เว็บไซต์ สิ่งพิมพ์ โฆษณา หรือโปรเจกต์เชิงพาณิชย์ ไม่มีค่าลิขสิทธิ์ ไม่มีลายน้ำ เป็นเจ้าของเต็มที่',
      },
    ],
    cta: {
      title: 'เริ่มสร้างรูปภาพ AI เลย',
      buttonText: 'ลองเครื่องสร้างรูปภาพ AI ฟรี',
    },
    seoText:
      'Voicica AI สร้างรูปภาพ เปลี่ยนไอเดียของคุณเป็นภาพสวยงามในไม่กี่วินาที ไม่ว่าคุณต้องการกราฟิกโซเชียลมีเดีย ภาพปกYouTube คอนเซปต์อาร์ต ภาพสินค้า หรือภาพวาดสร้างสรรค์ — แค่อธิบายสิ่งที่ต้องการแล้ว AI จะสร้างให้ ขับเคลื่อนด้วย 4 โมเดลล้ำสมัย รวมถึง Nano Banana Pro ที่มีความสามารถด้านการใช้เหตุผล รองรับข้อความเป็นภาพและภาพเป็นภาพ ความละเอียดสูงสุด 4K เครดิตฟรีทุกวัน — ไม่ต้องมีประสบการณ์ด้านการออกแบบ',
    metadata: {
      title: 'AI สร้างรูปภาพ — สร้างภาพจากข้อความ | Voicica AI',
      description:
        'สร้างภาพ AI สวยงามจากข้อความ 4 โมเดลทรงพลัง ข้อความเป็นภาพ & ภาพเป็นภาพ ความละเอียดสูงสุด 4K เครื่องสร้างภาพฟรีปลอดค่าลิขสิทธิ์',
      keywords: [
        'AI สร้างรูปภาพ',
        'ข้อความเป็นภาพ',
        'AI สร้างงานศิลปะ',
        'AI สร้างภาพ',
        'สร้างภาพฟรี',
        'AI อาร์ตเมคเกอร์',
        'AI ภาพวาด',
        'AI วาดรูป',
      ],
    },
  },
  es: {
    hero: {
      title: 'Generador de Imágenes IA — Crea Visuales Impresionantes desde Texto',
      subtitle:
        'Describe cualquier escena, personaje o concepto — la IA genera imágenes hermosas en segundos. Elige entre 4 modelos potentes, múltiples estilos y resolución hasta 4K. 100% libre de regalías.',
    },
    features: [
      {
        title: '4 Modelos IA Potentes',
        description:
          'Elige el modelo perfecto — Z-Image para resultados ultrarrápidos, Flux.2 para calidad equilibrada, Seedream 4.5 para estilos diversos, o Nano Banana Pro para obras maestras fotorrealistas en 4K.',
      },
      {
        title: 'Texto a Imagen e Imagen a Imagen',
        description:
          'Genera imágenes desde prompts de texto, o sube una imagen de referencia para generación guiada. Refina, remezcla e itera hasta que tu visión sea perfecta.',
      },
      {
        title: 'Generador de Prompts IA',
        description:
          '¿No sabes cómo describir tu idea? Escribe una frase simple y nuestro Generador de Prompts IA la expande en un prompt detallado y optimizado para los mejores resultados.',
      },
      {
        title: 'Relaciones de Aspecto y Calidad Flexibles',
        description:
          'Crea imágenes en cualquier formato — paisajes 16:9, historias 9:16, cuadrados 1:1 y más. Salida en resolución 1K, 2K o 4K según el modelo.',
      },
      {
        title: 'Todos los Estilos Imaginables',
        description:
          'Retratos fotorrealistas, ilustraciones anime, acuarelas, arte conceptual, mockups de productos, renders 3D — la IA se adapta a cualquier estilo artístico que describas.',
      },
      {
        title: '100% Libre de Regalías',
        description:
          'Todas las imágenes generadas son tuyas — redes sociales, sitios web, impresión, publicidad o proyectos comerciales. Sin tarifas de licencia, sin marcas de agua, propiedad total.',
      },
    ],
    cta: {
      title: 'Empieza a Crear Imágenes IA Ahora',
      buttonText: 'Prueba el Generador de Imágenes IA Gratis',
    },
    seoText:
      'Voicica Generador de Imágenes IA transforma tus ideas en visuales impresionantes en segundos. Ya sea que necesites gráficos para redes sociales, miniaturas de YouTube, arte conceptual, imágenes de productos o ilustraciones creativas — simplemente describe lo que quieres y la IA lo genera. Impulsado por 4 modelos de última generación incluyendo Nano Banana Pro con capacidades de razonamiento, Voicica soporta generación texto a imagen e imagen a imagen en resoluciones hasta 4K. El Generador de Prompts IA integrado te ayuda a crear prompts perfectos desde descripciones simples. Créditos gratis cada día — no se requiere experiencia en diseño.',
    metadata: {
      title: 'Generador de Imágenes IA — Crea Imágenes desde Texto | Voicica AI',
      description:
        'Genera impresionantes imágenes IA desde prompts de texto. 4 modelos potentes, texto a imagen e imagen a imagen, resolución hasta 4K. Creador de imágenes gratis y libre de regalías.',
      keywords: [
        'generador de imágenes IA',
        'texto a imagen',
        'generador de arte IA',
        'creador de imágenes IA',
        'generador de imágenes gratis',
        'creador de arte IA',
        'texto a imagen IA',
        'ilustración IA',
      ],
    },
  },
};
