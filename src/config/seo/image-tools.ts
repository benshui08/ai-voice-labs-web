export interface ImageToolsLocaleContent {
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

export const IMAGE_TOOLS_CONTENT: Record<string, ImageToolsLocaleContent> = {
  en: {
    hero: {
      title: 'AI Image Tools — Background Remover & HD Upscaler',
      subtitle:
        'Remove backgrounds in one click or upscale low-resolution images to HD with AI. Fast, accurate, and affordable — supports JPG, PNG, and WebP formats.',
    },
    features: [
      {
        title: 'AI Background Remover',
        description:
          'Remove image backgrounds instantly with AI precision. Perfect for product photos, portraits, ID photos, and social media content. Clean cutouts with smooth edges in seconds.',
      },
      {
        title: 'HD Image Upscaler',
        description:
          'Enhance low-resolution images to crystal-clear HD quality using AI. Recover details, sharpen textures, and upscale photos without losing quality — ideal for printing and large displays.',
      },
      {
        title: 'Product Photography Ready',
        description:
          'Create professional product images for e-commerce, remove backgrounds for marketplace listings, or prepare ID photos with clean white backgrounds. Business-ready in seconds.',
      },
      {
        title: 'Supports Multiple Formats',
        description:
          'Upload and process images in JPG, PNG, and WebP formats. Download results in your preferred format with full transparency support for background-removed images.',
      },
      {
        title: 'Fast Processing',
        description:
          'Get results in 10–30 seconds. No waiting, no queue — AI processes your images instantly so you can focus on what matters. Batch multiple images for efficient workflows.',
      },
      {
        title: 'Credit-Based Pricing',
        description:
          'Each operation costs just 1 credit. No subscriptions required — use credits as needed. Free daily credits included so you can start using the tools right away.',
      },
    ],
    cta: {
      title: 'Start Using AI Image Tools Now',
      buttonText: 'Try Free Image Tools',
    },
    seoText:
      'Voicica AI Image Tools includes a powerful Background Remover and HD Image Upscaler. Remove backgrounds from product photos, portraits, and ID photos with one click — AI delivers clean cutouts with smooth edges in seconds. The HD Upscaler enhances low-resolution images to crystal-clear quality, recovering details and sharpening textures using advanced AI models. Supports JPG, PNG, and WebP formats with full transparency. Processing takes just 10–30 seconds per image, and each operation costs only 1 credit. Free daily credits included — no design skills required.',
    metadata: {
      title: 'AI Image Tools — Background Remover & HD Upscaler | Voicica AI',
      description:
        'Remove backgrounds and upscale images with AI. One-click background removal, HD upscaling, supports JPG/PNG/WebP. Fast processing, 1 credit per use.',
      keywords: [
        'background remover',
        'remove background',
        'image upscaler',
        'HD upscale',
        'AI image tools',
        'remove bg',
        'photo enhancer',
        'image background remover',
      ],
    },
  },
  ja: {
    hero: {
      title: 'AI画像ツール — 背景除去＆HD高画質化',
      subtitle:
        'ワンクリックで背景を除去、またはAIで低解像度画像をHDにアップスケール。高速・正確・お手頃 — JPG、PNG、WebP形式に対応。',
    },
    features: [
      {
        title: 'AI背景除去',
        description:
          'AI精度で画像の背景を瞬時に除去。商品写真、ポートレート、証明写真、SNSコンテンツに最適。数秒で滑らかなエッジの綺麗な切り抜きを実現。',
      },
      {
        title: 'HD画像アップスケーラー',
        description:
          'AIを使って低解像度画像をクリスタルクリアなHD品質に向上。ディテールを復元、テクスチャをシャープに、品質を落とさず写真を拡大 — 印刷や大型ディスプレイに最適。',
      },
      {
        title: '商品撮影対応',
        description:
          'ECサイト向けのプロフェッショナルな商品画像を作成、マーケットプレイス出品用の背景除去、白背景の証明写真の準備。数秒でビジネス対応品質。',
      },
      {
        title: '複数フォーマット対応',
        description:
          'JPG、PNG、WebP形式の画像をアップロード＆処理。背景除去画像は透過対応で、お好みの形式でダウンロード可能。',
      },
      {
        title: '高速処理',
        description:
          '10〜30秒で結果を取得。待ち時間なし、キューなし — AIが画像を即座に処理。効率的なワークフローのために複数画像の一括処理も可能。',
      },
      {
        title: 'クレジット制料金',
        description:
          '各操作はわずか1クレジット。サブスク不要 — 必要な分だけクレジットを使用。毎日無料クレジット付きですぐに使い始められます。',
      },
    ],
    cta: {
      title: '今すぐAI画像ツールを使う',
      buttonText: '無料で画像ツールを試す',
    },
    seoText:
      'Voicica AI画像ツールには、強力な背景除去とHD画像アップスケーラーが含まれています。商品写真、ポートレート、証明写真の背景をワンクリックで除去 — AIが数秒で滑らかなエッジの綺麗な切り抜きを提供。HDアップスケーラーは高度なAIモデルを使用して低解像度画像をクリスタルクリアな品質に向上、ディテールを復元しテクスチャをシャープに。JPG、PNG、WebP形式対応、完全透過サポート。処理は画像1枚あたりわずか10〜30秒、各操作はたった1クレジット。毎日無料クレジット付き — デザインスキル不要。',
    metadata: {
      title: 'AI画像ツール — 背景除去＆HD高画質化 | Voicica AI',
      description:
        'AIで背景除去と画像アップスケール。ワンクリック背景除去、HD高画質化、JPG/PNG/WebP対応。高速処理、1回1クレジット。',
      keywords: [
        '背景除去',
        '背景を消す',
        '画像アップスケーラー',
        'HD高画質化',
        'AI画像ツール',
        '背景透過',
        '写真高画質化',
        '画像背景除去',
      ],
    },
  },
  'zh-Hant': {
    hero: {
      title: 'AI圖片工具 — 去背＆HD高畫質放大',
      subtitle:
        '一鍵去除背景，或用AI將低解析度圖片放大至HD。快速、精準、實惠——支援JPG、PNG、WebP格式。',
    },
    features: [
      {
        title: 'AI去背工具',
        description:
          '以AI精準度瞬間去除圖片背景。適合產品照、人像、證件照和社群媒體內容。幾秒內實現邊緣平滑的乾淨裁切。',
      },
      {
        title: 'HD圖片放大器',
        description:
          '使用AI將低解析度圖片增強至清晰HD品質。恢復細節、銳化紋理、放大照片不失真——適合列印和大型顯示。',
      },
      {
        title: '產品攝影就緒',
        description:
          '為電商建立專業產品圖、為賣場上架去除背景、或準備白底證件照。幾秒內達到商用品質。',
      },
      {
        title: '支援多種格式',
        description:
          '上傳並處理JPG、PNG和WebP格式的圖片。去背圖片完整支援透明背景，以你偏好的格式下載結果。',
      },
      {
        title: '快速處理',
        description:
          '10-30秒獲得結果。無需等待、無需排隊——AI立即處理你的圖片。支援批次處理多張圖片，高效工作流程。',
      },
      {
        title: '按次計費',
        description:
          '每次操作僅需1點數。無需訂閱——按需使用點數。每日贈送免費點數，讓你立即開始使用。',
      },
    ],
    cta: {
      title: '立即使用AI圖片工具',
      buttonText: '免費試用圖片工具',
    },
    seoText:
      'Voicica AI圖片工具包含強大的去背工具和HD圖片放大器。一鍵去除產品照、人像和證件照的背景——AI在幾秒內提供邊緣平滑的乾淨裁切。HD放大器使用先進AI模型將低解析度圖片增強至清晰品質，恢復細節並銳化紋理。支援JPG、PNG和WebP格式，完整透明背景支援。每張圖片處理僅需10-30秒，每次操作僅需1點數。每日贈送免費點數——無需設計技能。',
    metadata: {
      title: 'AI圖片工具 — 去背＆HD放大 | Voicica AI',
      description:
        '用AI去除背景和放大圖片。一鍵去背、HD放大、支援JPG/PNG/WebP。快速處理，每次1點數。',
      keywords: [
        '去背工具',
        '去除背景',
        '圖片放大器',
        'HD放大',
        'AI圖片工具',
        '背景移除',
        '照片增強',
        '圖片去背',
      ],
    },
  },
  ko: {
    hero: {
      title: 'AI 이미지 도구 — 배경 제거 & HD 업스케일러',
      subtitle:
        '원클릭 배경 제거 또는 AI로 저해상도 이미지를 HD로 업스케일. 빠르고, 정확하고, 저렴 — JPG, PNG, WebP 형식 지원.',
    },
    features: [
      {
        title: 'AI 배경 제거',
        description:
          'AI 정밀도로 이미지 배경을 즉시 제거. 제품 사진, 인물 사진, 증명사진, SNS 콘텐츠에 최적. 몇 초 만에 부드러운 엣지의 깔끔한 컷아웃.',
      },
      {
        title: 'HD 이미지 업스케일러',
        description:
          'AI를 사용하여 저해상도 이미지를 선명한 HD 품질로 향상. 디테일 복원, 텍스처 선명화, 품질 손실 없이 사진 확대 — 인쇄 및 대형 디스플레이에 이상적.',
      },
      {
        title: '제품 사진 대응',
        description:
          '전자상거래용 전문 제품 이미지 제작, 마켓플레이스 등록을 위한 배경 제거, 흰 배경 증명사진 준비. 몇 초 만에 비즈니스 대응 품질.',
      },
      {
        title: '다양한 형식 지원',
        description:
          'JPG, PNG, WebP 형식의 이미지를 업로드 및 처리. 배경 제거 이미지는 완전한 투명도 지원으로 원하는 형식으로 다운로드.',
      },
      {
        title: '빠른 처리',
        description:
          '10~30초 만에 결과 제공. 대기 없음, 큐 없음 — AI가 이미지를 즉시 처리. 효율적인 워크플로우를 위한 배치 처리 지원.',
      },
      {
        title: '크레딧 기반 과금',
        description:
          '각 작업은 단 1크레딧. 구독 불필요 — 필요한 만큼 크레딧 사용. 매일 무료 크레딧 포함으로 바로 사용 가능.',
      },
    ],
    cta: {
      title: '지금 AI 이미지 도구 사용 시작',
      buttonText: '무료 이미지 도구 체험',
    },
    seoText:
      'Voicica AI 이미지 도구에는 강력한 배경 제거기와 HD 이미지 업스케일러가 포함되어 있습니다. 제품 사진, 인물 사진, 증명사진의 배경을 원클릭으로 제거 — AI가 몇 초 만에 부드러운 엣지의 깔끔한 컷아웃을 제공합니다. HD 업스케일러는 고급 AI 모델로 저해상도 이미지를 선명한 품질로 향상, 디테일 복원 및 텍스처 선명화. JPG, PNG, WebP 형식 지원, 완전한 투명도 지원. 이미지당 10~30초 처리, 각 작업은 단 1크레딧.',
    metadata: {
      title: 'AI 이미지 도구 — 배경 제거 & HD 업스케일러 | Voicica AI',
      description:
        'AI로 배경 제거 및 이미지 업스케일. 원클릭 배경 제거, HD 업스케일, JPG/PNG/WebP 지원. 빠른 처리, 1크레딧.',
      keywords: [
        '배경 제거',
        '배경 지우기',
        '이미지 업스케일러',
        'HD 업스케일',
        'AI 이미지 도구',
        '배경 삭제',
        '사진 보정',
        '이미지 배경 제거',
      ],
    },
  },
  th: {
    hero: {
      title: 'เครื่องมือรูปภาพ AI — ลบพื้นหลัง & ขยายภาพ HD',
      subtitle:
        'ลบพื้นหลังในคลิกเดียวหรือขยายภาพความละเอียดต่ำเป็น HD ด้วย AI รวดเร็ว แม่นยำ และราคาเข้าถึงได้ — รองรับ JPG, PNG และ WebP',
    },
    features: [
      {
        title: 'AI ลบพื้นหลัง',
        description:
          'ลบพื้นหลังรูปภาพทันทีด้วยความแม่นยำ AI เหมาะสำหรับภาพสินค้า ภาพบุคคล ภาพถ่ายบัตรประจำตัว และเนื้อหาโซเชียลมีเดีย ได้ภาพตัดขอบเรียบในไม่กี่วินาที',
      },
      {
        title: 'ขยายภาพ HD',
        description:
          'เพิ่มคุณภาพภาพความละเอียดต่ำเป็น HD คมชัดด้วย AI กู้คืนรายละเอียด เพิ่มความคมชัดเทกซ์เจอร์ ขยายภาพโดยไม่เสียคุณภาพ — เหมาะสำหรับพิมพ์และจอแสดงผลขนาดใหญ่',
      },
      {
        title: 'พร้อมสำหรับภาพสินค้า',
        description:
          'สร้างภาพสินค้าระดับมืออาชีพสำหรับอีคอมเมิร์ซ ลบพื้นหลังสำหรับลงขายในมาร์เก็ตเพลส หรือเตรียมภาพบัตรประจำตัวพื้นหลังขาว พร้อมใช้งานธุรกิจในไม่กี่วินาที',
      },
      {
        title: 'รองรับหลายรูปแบบ',
        description:
          'อัปโหลดและประมวลผลรูปภาพในรูปแบบ JPG, PNG และ WebP ดาวน์โหลดผลลัพธ์ในรูปแบบที่ต้องการ รองรับพื้นหลังโปร่งใสเต็มรูปแบบ',
      },
      {
        title: 'ประมวลผลรวดเร็ว',
        description:
          'ได้ผลลัพธ์ใน 10-30 วินาที ไม่ต้องรอ ไม่มีคิว — AI ประมวลผลรูปภาพทันที รองรับการประมวลผลหลายภาพสำหรับเวิร์กโฟลว์ที่มีประสิทธิภาพ',
      },
      {
        title: 'คิดค่าบริการตามเครดิต',
        description:
          'แต่ละการดำเนินการใช้เพียง 1 เครดิต ไม่ต้องสมัครสมาชิก — ใช้เครดิตตามต้องการ รวมเครดิตฟรีรายวันเพื่อเริ่มใช้งานได้ทันที',
      },
    ],
    cta: {
      title: 'เริ่มใช้เครื่องมือรูปภาพ AI เลย',
      buttonText: 'ลองเครื่องมือรูปภาพฟรี',
    },
    seoText:
      'Voicica เครื่องมือรูปภาพ AI รวมเครื่องลบพื้นหลังและขยายภาพ HD ที่ทรงพลัง ลบพื้นหลังจากภาพสินค้า ภาพบุคคล และภาพบัตรประจำตัวในคลิกเดียว — AI ให้ภาพตัดขอบเรียบในไม่กี่วินาที เครื่องขยายภาพ HD ใช้โมเดล AI ขั้นสูงเพิ่มคุณภาพภาพความละเอียดต่ำเป็นคุณภาพคมชัด กู้คืนรายละเอียดและเพิ่มความคมชัดเทกซ์เจอร์ รองรับ JPG, PNG และ WebP พร้อมพื้นหลังโปร่งใส ประมวลผลใช้เวลาเพียง 10-30 วินาทีต่อภาพ แต่ละการดำเนินการใช้เพียง 1 เครดิต เครดิตฟรีรายวัน — ไม่ต้องมีทักษะออกแบบ',
    metadata: {
      title: 'เครื่องมือรูปภาพ AI — ลบพื้นหลัง & ขยายภาพ HD | Voicica AI',
      description:
        'ลบพื้นหลังและขยายรูปภาพด้วย AI ลบพื้นหลังคลิกเดียว ขยายภาพ HD รองรับ JPG/PNG/WebP ประมวลผลรวดเร็ว 1 เครดิตต่อครั้ง',
      keywords: [
        'ลบพื้นหลัง',
        'ลบแบคกราวด์',
        'ขยายภาพ',
        'HD อัปสเกล',
        'เครื่องมือรูปภาพ AI',
        'ลบ bg',
        'ปรับปรุงภาพ',
        'ลบพื้นหลังรูปภาพ',
      ],
    },
  },
  es: {
    hero: {
      title: 'Herramientas de Imagen IA — Eliminador de Fondos y Escalador HD',
      subtitle:
        'Elimina fondos en un clic o escala imágenes de baja resolución a HD con IA. Rápido, preciso y asequible — soporta formatos JPG, PNG y WebP.',
    },
    features: [
      {
        title: 'Eliminador de Fondos IA',
        description:
          'Elimina fondos de imágenes al instante con precisión IA. Perfecto para fotos de productos, retratos, fotos de identificación y contenido para redes sociales. Recortes limpios con bordes suaves en segundos.',
      },
      {
        title: 'Escalador de Imágenes HD',
        description:
          'Mejora imágenes de baja resolución a calidad HD cristalina usando IA. Recupera detalles, mejora texturas y escala fotos sin perder calidad — ideal para impresión y pantallas grandes.',
      },
      {
        title: 'Listo para Fotografía de Producto',
        description:
          'Crea imágenes de productos profesionales para e-commerce, elimina fondos para listados en marketplaces o prepara fotos de identificación con fondo blanco limpio. Calidad profesional en segundos.',
      },
      {
        title: 'Soporta Múltiples Formatos',
        description:
          'Sube y procesa imágenes en formatos JPG, PNG y WebP. Descarga resultados en tu formato preferido con soporte completo de transparencia para imágenes sin fondo.',
      },
      {
        title: 'Procesamiento Rápido',
        description:
          'Obtén resultados en 10-30 segundos. Sin espera, sin cola — la IA procesa tus imágenes al instante para que puedas enfocarte en lo importante. Procesa múltiples imágenes por lotes.',
      },
      {
        title: 'Precio por Créditos',
        description:
          'Cada operación cuesta solo 1 crédito. Sin suscripciones — usa créditos según necesites. Créditos diarios gratis incluidos para empezar a usar las herramientas de inmediato.',
      },
    ],
    cta: {
      title: 'Empieza a Usar Herramientas de Imagen IA',
      buttonText: 'Prueba Herramientas de Imagen Gratis',
    },
    seoText:
      'Voicica Herramientas de Imagen IA incluye un potente Eliminador de Fondos y Escalador de Imágenes HD. Elimina fondos de fotos de productos, retratos y fotos de identificación con un clic — la IA ofrece recortes limpios con bordes suaves en segundos. El Escalador HD mejora imágenes de baja resolución a calidad cristalina, recuperando detalles y mejorando texturas usando modelos IA avanzados. Soporta formatos JPG, PNG y WebP con transparencia completa. El procesamiento toma solo 10-30 segundos por imagen, y cada operación cuesta solo 1 crédito. Créditos diarios gratis incluidos — no se requieren habilidades de diseño.',
    metadata: {
      title: 'Herramientas de Imagen IA — Eliminador de Fondos y Escalador HD | Voicica AI',
      description:
        'Elimina fondos y escala imágenes con IA. Eliminación de fondo en un clic, escalado HD, soporta JPG/PNG/WebP. Procesamiento rápido, 1 crédito por uso.',
      keywords: [
        'eliminador de fondos',
        'eliminar fondo',
        'escalador de imágenes',
        'escalado HD',
        'herramientas de imagen IA',
        'quitar fondo',
        'mejorar fotos',
        'eliminar fondo de imagen',
      ],
    },
  },
};
