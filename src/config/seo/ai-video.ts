export interface AiVideoLocaleContent {
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

export const AI_VIDEO_CONTENT: Record<string, AiVideoLocaleContent> = {
  en: {
    hero: {
      title: 'AI Video Generator — Create Cinematic Videos from Text',
      subtitle:
        'Describe any scene and AI generates stunning videos in seconds. Powered by Seedance 1.5 Pro — cinematic quality, multiple resolutions, flexible aspect ratios, and AI audio generation.',
    },
    features: [
      {
        title: 'Text-to-Video Generation',
        description:
          'Simply describe a scene, action, or story — AI transforms your text into a high-quality video clip. No filming, no editing, no experience required.',
      },
      {
        title: 'Multiple Quality & Duration',
        description:
          'Choose the resolution (480p or 720p) and duration (4s, 8s, or 12s) that fits your project. Quick previews or longer cinematic clips — it\'s up to you.',
      },
      {
        title: 'Flexible Aspect Ratios',
        description:
          'Create videos in any format — 16:9 landscape for YouTube, 9:16 portrait for TikTok/Reels, 1:1 square, 4:3 classic, 3:4 portrait, or ultra-wide 21:9 cinematic.',
      },
      {
        title: 'Image-Guided Generation',
        description:
          'Upload a reference image to guide the video style, composition, or subject. Combine text prompts with visual references for precise creative control.',
      },
      {
        title: 'AI Audio Generation',
        description:
          'Automatically generate matching audio and sound effects for your videos. Create complete video content with synchronized voiceover and background music.',
      },
      {
        title: 'Cinematic AI Model',
        description:
          'Powered by Seedance 1.5 Pro — a state-of-the-art video generation model delivering cinematic-quality visuals with smooth motion, realistic lighting, and stunning detail.',
      },
    ],
    cta: {
      title: 'Start Creating AI Videos Now',
      buttonText: 'Try Free AI Video Generator',
    },
    seoText:
      'Voicica AI Video Generator transforms your ideas into cinematic videos in seconds. Powered by the cutting-edge Seedance 1.5 Pro model, it delivers stunning visual quality with smooth motion and realistic lighting. Create videos from text descriptions or use reference images for guided generation. Choose from 6 aspect ratios including 16:9, 9:16, 1:1, and ultra-wide 21:9. Select 480p or 720p resolution and 4s to 12s duration. AI audio generation adds synchronized sound to your videos automatically. Perfect for social media content, marketing videos, creative projects, and storytelling. Free credits every day — no video editing experience required.',
    metadata: {
      title: 'AI Video Generator — Create Videos from Text | Voicica AI',
      description:
        'Generate cinematic AI videos from text prompts. Seedance 1.5 Pro model, 6 aspect ratios, 480p-720p, 4-12s duration, AI audio. Free video creator.',
      keywords: [
        'AI video generator',
        'text to video',
        'AI video maker',
        'AI video creator',
        'free video generator',
        'text to video AI',
        'AI movie maker',
        'AI video editing',
      ],
    },
  },
  ja: {
    hero: {
      title: 'AI動画ジェネレーター — テキストからシネマティック動画を作成',
      subtitle:
        'シーンを説明するだけで、AIが数秒で素晴らしい動画を生成。Seedance 1.5 Pro搭載 — 映画品質、複数の解像度、柔軟なアスペクト比、AI音声生成。',
    },
    features: [
      {
        title: 'テキストから動画生成',
        description:
          'シーン、アクション、ストーリーを説明するだけで、AIがテキストを高品質な動画クリップに変換。撮影不要、編集不要、経験不要。',
      },
      {
        title: '多彩な画質＆時間',
        description:
          'プロジェクトに合わせて解像度（480pまたは720p）と時間（4秒、8秒、12秒）を選択。クイックプレビューからシネマティッククリップまで自由自在。',
      },
      {
        title: '柔軟なアスペクト比',
        description:
          'あらゆるフォーマットで動画を作成 — YouTube向け16:9横長、TikTok/Reels向け9:16縦長、1:1正方形、4:3クラシック、3:4ポートレート、超ワイド21:9シネマティック。',
      },
      {
        title: '画像ガイド生成',
        description:
          '参考画像をアップロードして動画のスタイル、構図、被写体をガイド。テキストプロンプトとビジュアル参考を組み合わせて正確なクリエイティブコントロール。',
      },
      {
        title: 'AI音声生成',
        description:
          '動画にマッチする音声と効果音を自動生成。同期されたナレーションとBGMで完全な動画コンテンツを作成。',
      },
      {
        title: 'シネマティックAIモデル',
        description:
          'Seedance 1.5 Pro搭載 — 滑らかなモーション、リアルなライティング、驚くべきディテールで映画品質のビジュアルを提供する最先端の動画生成モデル。',
      },
    ],
    cta: {
      title: '今すぐAI動画を作成',
      buttonText: '無料AI動画ジェネレーターを試す',
    },
    seoText:
      'Voicica AI動画ジェネレーターは、あなたのアイデアを数秒でシネマティック動画に変えます。最先端のSeedance 1.5 Proモデルで、滑らかなモーションとリアルなライティングの素晴らしいビジュアル品質を実現。テキスト説明から動画を作成、または参考画像を使ったガイド生成が可能。16:9、9:16、1:1、超ワイド21:9を含む6つのアスペクト比から選択。480pまたは720p解像度、4秒から12秒の時間を選択。AI音声生成が動画に同期されたサウンドを自動追加。SNSコンテンツ、マーケティング動画、クリエイティブプロジェクト、ストーリーテリングに最適。毎日無料クレジット — 動画編集の経験は不要です。',
    metadata: {
      title: 'AI動画ジェネレーター — テキストから動画作成 | Voicica AI',
      description:
        'テキストプロンプトからシネマティックAI動画を生成。Seedance 1.5 Proモデル、6つのアスペクト比、480p-720p、4-12秒、AI音声。無料動画クリエイター。',
      keywords: [
        'AI動画ジェネレーター',
        'テキストから動画',
        'AI動画作成',
        'AI動画メーカー',
        '無料動画生成',
        'AI映像制作',
        'AIビデオ',
        'AI動画編集',
      ],
    },
  },
  'zh-Hant': {
    hero: {
      title: 'AI影片生成器 — 從文字創造電影級影片',
      subtitle:
        '描述任何場景，AI在幾秒內生成震撼影片。搭載Seedance 1.5 Pro — 電影級畫質、多種解析度、靈活寬高比、AI音訊生成。',
    },
    features: [
      {
        title: '文字轉影片',
        description:
          '只需描述場景、動作或故事——AI將你的文字轉化為高品質影片。無需拍攝、無需剪輯、無需經驗。',
      },
      {
        title: '多種畫質與時長',
        description:
          '選擇適合專案的解析度（480p或720p）和時長（4秒、8秒或12秒）。快速預覽或較長的電影級片段——由你決定。',
      },
      {
        title: '靈活的寬高比',
        description:
          '以任何格式創建影片——YouTube用16:9橫幅、TikTok/Reels用9:16直幅、1:1方形、4:3經典、3:4直幅、超寬21:9電影級。',
      },
      {
        title: '圖片引導生成',
        description:
          '上傳參考圖片引導影片的風格、構圖或主題。結合文字提示與視覺參考，精確控制創意方向。',
      },
      {
        title: 'AI音訊生成',
        description:
          '自動為影片生成匹配的音訊和音效。創建配有同步配音和背景音樂的完整影片內容。',
      },
      {
        title: '電影級AI模型',
        description:
          '搭載Seedance 1.5 Pro——最先進的影片生成模型，提供流暢動態、逼真光影和驚豔細節的電影級視覺效果。',
      },
    ],
    cta: {
      title: '立即開始創作AI影片',
      buttonText: '免費試用AI影片生成器',
    },
    seoText:
      'Voicica AI影片生成器能在數秒內將你的想法化為電影級影片。搭載最先端的Seedance 1.5 Pro模型，呈現流暢動態和逼真光影的驚豔視覺品質。從文字描述創建影片，或使用參考圖片進行引導生成。支援6種寬高比，包括16:9、9:16、1:1和超寬21:9。選擇480p或720p解析度及4秒至12秒時長。AI音訊生成自動為影片添加同步聲音。適合社群媒體內容、行銷影片、創意專案和故事敘述。每天免費額度——無需影片編輯經驗。',
    metadata: {
      title: 'AI影片生成器 — 從文字創建影片 | Voicica AI',
      description:
        '從文字提示生成電影級AI影片。Seedance 1.5 Pro模型、6種寬高比、480p-720p、4-12秒、AI音訊。免費影片創作工具。',
      keywords: [
        'AI影片生成器',
        '文字轉影片',
        'AI影片製作',
        'AI影片創作',
        '免費影片生成',
        'AI視頻',
        'AI影像製作',
        'AI動畫',
      ],
    },
  },
  ko: {
    hero: {
      title: 'AI 동영상 생성기 — 텍스트로 시네마틱 영상 만들기',
      subtitle:
        '장면을 설명하면 AI가 몇 초 만에 멋진 동영상을 생성합니다. Seedance 1.5 Pro 탑재 — 영화급 품질, 다양한 해상도, 유연한 화면 비율, AI 오디오 생성.',
    },
    features: [
      {
        title: '텍스트-영상 생성',
        description:
          '장면, 액션, 스토리를 설명하기만 하면 AI가 텍스트를 고품질 영상 클립으로 변환합니다. 촬영 불필요, 편집 불필요, 경험 불필요.',
      },
      {
        title: '다양한 화질 & 길이',
        description:
          '프로젝트에 맞는 해상도(480p 또는 720p)와 길이(4초, 8초, 12초)를 선택하세요. 빠른 미리보기부터 긴 시네마틱 클립까지 자유자재.',
      },
      {
        title: '유연한 화면 비율',
        description:
          '모든 형식으로 영상 제작 — YouTube용 16:9 가로, TikTok/Reels용 9:16 세로, 1:1 정사각형, 4:3 클래식, 3:4 세로, 울트라와이드 21:9 시네마틱.',
      },
      {
        title: '이미지 가이드 생성',
        description:
          '참조 이미지를 업로드하여 영상 스타일, 구도, 주제를 가이드. 텍스트 프롬프트와 시각적 참조를 결합하여 정밀한 크리에이티브 컨트롤.',
      },
      {
        title: 'AI 오디오 생성',
        description:
          '영상에 맞는 오디오와 효과음을 자동 생성. 동기화된 내레이션과 배경 음악이 포함된 완전한 영상 콘텐츠를 제작.',
      },
      {
        title: '시네마틱 AI 모델',
        description:
          'Seedance 1.5 Pro 탑재 — 부드러운 모션, 사실적인 라이팅, 놀라운 디테일로 영화급 비주얼을 제공하는 최첨단 영상 생성 모델.',
      },
    ],
    cta: {
      title: '지금 AI 동영상 만들기 시작',
      buttonText: '무료 AI 동영상 생성기 체험',
    },
    seoText:
      'Voicica AI 동영상 생성기는 당신의 아이디어를 몇 초 만에 시네마틱 영상으로 변환합니다. 최첨단 Seedance 1.5 Pro 모델로 부드러운 모션과 사실적인 라이팅의 멋진 비주얼 품질을 실현. 텍스트 설명에서 영상을 만들거나 참조 이미지를 사용한 가이드 생성이 가능합니다. 16:9, 9:16, 1:1, 울트라와이드 21:9를 포함한 6가지 화면 비율에서 선택. 480p 또는 720p 해상도와 4초에서 12초 길이를 선택하세요. AI 오디오 생성이 영상에 동기화된 사운드를 자동 추가. SNS 콘텐츠, 마케팅 영상, 크리에이티브 프로젝트, 스토리텔링에 최적.',
    metadata: {
      title: 'AI 동영상 생성기 — 텍스트로 영상 만들기 | Voicica AI',
      description:
        '텍스트 프롬프트로 시네마틱 AI 동영상을 생성하세요. Seedance 1.5 Pro 모델, 6가지 화면 비율, 480p-720p, 4-12초, AI 오디오. 무료 영상 크리에이터.',
      keywords: [
        'AI 동영상 생성기',
        '텍스트 투 비디오',
        'AI 영상 만들기',
        'AI 비디오 메이커',
        '무료 영상 생성',
        'AI 동영상 제작',
        'AI 비디오',
        'AI 영상 편집',
      ],
    },
  },
  th: {
    hero: {
      title: 'AI สร้างวิดีโอ — สร้างวิดีโอระดับภาพยนตร์จากข้อความ',
      subtitle:
        'อธิบายฉากใดก็ได้ แล้ว AI จะสร้างวิดีโอที่น่าทึ่งในไม่กี่วินาที ขับเคลื่อนด้วย Seedance 1.5 Pro — คุณภาพระดับภาพยนตร์ หลายความละเอียด อัตราส่วนภาพยืดหยุ่น และสร้างเสียง AI',
    },
    features: [
      {
        title: 'สร้างวิดีโอจากข้อความ',
        description:
          'แค่อธิบายฉาก แอคชั่น หรือเรื่องราว — AI จะแปลงข้อความของคุณเป็นคลิปวิดีโอคุณภาพสูง ไม่ต้องถ่ายทำ ไม่ต้องตัดต่อ ไม่ต้องมีประสบการณ์',
      },
      {
        title: 'หลายคุณภาพ & ความยาว',
        description:
          'เลือกความละเอียด (480p หรือ 720p) และความยาว (4 วินาที, 8 วินาที หรือ 12 วินาที) ที่เหมาะกับโปรเจกต์ของคุณ พรีวิวด่วนหรือคลิปยาวระดับภาพยนตร์ — คุณเลือกเอง',
      },
      {
        title: 'อัตราส่วนภาพยืดหยุ่น',
        description:
          'สร้างวิดีโอในทุกรูปแบบ — แนวนอน 16:9 สำหรับ YouTube, แนวตั้ง 9:16 สำหรับ TikTok/Reels, สี่เหลี่ยม 1:1, คลาสสิก 4:3, แนวตั้ง 3:4 หรือ อัลตร้าไวด์ 21:9',
      },
      {
        title: 'สร้างจากภาพอ้างอิง',
        description:
          'อัปโหลดภาพอ้างอิงเพื่อนำทางสไตล์ องค์ประกอบ หรือหัวข้อของวิดีโอ รวมข้อความพรอมต์กับภาพอ้างอิงเพื่อควบคุมครีเอทีฟอย่างแม่นยำ',
      },
      {
        title: 'สร้างเสียง AI',
        description:
          'สร้างเสียงและเอฟเฟกต์เสียงที่เข้ากันกับวิดีโอโดยอัตโนมัติ สร้างเนื้อหาวิดีโอสมบูรณ์พร้อมเสียงพากย์และเพลงประกอบที่ซิงค์กัน',
      },
      {
        title: 'โมเดล AI ระดับภาพยนตร์',
        description:
          'ขับเคลื่อนด้วย Seedance 1.5 Pro — โมเดลสร้างวิดีโอล้ำสมัยที่ให้ภาพระดับภาพยนตร์พร้อมการเคลื่อนไหวลื่น แสงสมจริง และรายละเอียดที่น่าทึ่ง',
      },
    ],
    cta: {
      title: 'เริ่มสร้างวิดีโอ AI เลย',
      buttonText: 'ลองเครื่องสร้างวิดีโอ AI ฟรี',
    },
    seoText:
      'Voicica AI สร้างวิดีโอ เปลี่ยนไอเดียของคุณเป็นวิดีโอระดับภาพยนตร์ในไม่กี่วินาที ขับเคลื่อนด้วยโมเดล Seedance 1.5 Pro ล้ำสมัย ให้คุณภาพภาพที่น่าทึ่งพร้อมการเคลื่อนไหวลื่นและแสงสมจริง สร้างวิดีโอจากข้อความหรือใช้ภาพอ้างอิงเพื่อนำทาง เลือกจาก 6 อัตราส่วนภาพรวมถึง 16:9, 9:16, 1:1 และอัลตร้าไวด์ 21:9 เลือกความละเอียด 480p หรือ 720p และความยาว 4 ถึง 12 วินาที ระบบสร้างเสียง AI เพิ่มเสียงที่ซิงค์กับวิดีโอโดยอัตโนมัติ เหมาะสำหรับเนื้อหาโซเชียลมีเดีย วิดีโอการตลาด โปรเจกต์สร้างสรรค์ และการเล่าเรื่อง เครดิตฟรีทุกวัน — ไม่ต้องมีประสบการณ์ตัดต่อวิดีโอ',
    metadata: {
      title: 'AI สร้างวิดีโอ — สร้างวิดีโอจากข้อความ | Voicica AI',
      description:
        'สร้างวิดีโอ AI ระดับภาพยนตร์จากข้อความ โมเดล Seedance 1.5 Pro 6 อัตราส่วนภาพ 480p-720p 4-12 วินาที เสียง AI เครื่องสร้างวิดีโอฟรี',
      keywords: [
        'AI สร้างวิดีโอ',
        'ข้อความเป็นวิดีโอ',
        'AI ทำวิดีโอ',
        'AI สร้างคลิป',
        'สร้างวิดีโอฟรี',
        'AI วิดีโอ',
        'AI ตัดต่อวิดีโอ',
        'AI ทำหนัง',
      ],
    },
  },
  es: {
    hero: {
      title: 'Generador de Video IA — Crea Videos Cinematográficos desde Texto',
      subtitle:
        'Describe cualquier escena y la IA genera videos impresionantes en segundos. Impulsado por Seedance 1.5 Pro — calidad cinematográfica, múltiples resoluciones, relaciones de aspecto flexibles y generación de audio IA.',
    },
    features: [
      {
        title: 'Generación de Texto a Video',
        description:
          'Simplemente describe una escena, acción o historia — la IA transforma tu texto en un clip de video de alta calidad. Sin filmación, sin edición, sin experiencia necesaria.',
      },
      {
        title: 'Múltiples Calidades y Duración',
        description:
          'Elige la resolución (480p o 720p) y duración (4s, 8s o 12s) que se ajuste a tu proyecto. Previsualizaciones rápidas o clips cinematográficos más largos — tú decides.',
      },
      {
        title: 'Relaciones de Aspecto Flexibles',
        description:
          'Crea videos en cualquier formato — 16:9 paisaje para YouTube, 9:16 vertical para TikTok/Reels, 1:1 cuadrado, 4:3 clásico, 3:4 retrato o ultra ancho 21:9 cinematográfico.',
      },
      {
        title: 'Generación Guiada por Imagen',
        description:
          'Sube una imagen de referencia para guiar el estilo, composición o sujeto del video. Combina prompts de texto con referencias visuales para un control creativo preciso.',
      },
      {
        title: 'Generación de Audio IA',
        description:
          'Genera automáticamente audio y efectos de sonido que coincidan con tus videos. Crea contenido de video completo con locución sincronizada y música de fondo.',
      },
      {
        title: 'Modelo IA Cinematográfico',
        description:
          'Impulsado por Seedance 1.5 Pro — un modelo de generación de video de última generación que ofrece visuales de calidad cinematográfica con movimiento suave, iluminación realista y detalles impresionantes.',
      },
    ],
    cta: {
      title: 'Empieza a Crear Videos IA Ahora',
      buttonText: 'Prueba el Generador de Video IA Gratis',
    },
    seoText:
      'Voicica Generador de Video IA transforma tus ideas en videos cinematográficos en segundos. Impulsado por el modelo de última generación Seedance 1.5 Pro, ofrece una calidad visual impresionante con movimiento suave e iluminación realista. Crea videos desde descripciones de texto o usa imágenes de referencia para generación guiada. Elige entre 6 relaciones de aspecto incluyendo 16:9, 9:16, 1:1 y ultra ancho 21:9. Selecciona resolución 480p o 720p y duración de 4s a 12s. La generación de audio IA añade sonido sincronizado a tus videos automáticamente. Perfecto para contenido de redes sociales, videos de marketing, proyectos creativos y narrativa. Créditos gratis cada día — no se requiere experiencia en edición de video.',
    metadata: {
      title: 'Generador de Video IA — Crea Videos desde Texto | Voicica AI',
      description:
        'Genera videos IA cinematográficos desde prompts de texto. Modelo Seedance 1.5 Pro, 6 relaciones de aspecto, 480p-720p, 4-12s, audio IA. Creador de video gratis.',
      keywords: [
        'generador de video IA',
        'texto a video',
        'creador de video IA',
        'hacer video IA',
        'generador de video gratis',
        'texto a video IA',
        'creador de películas IA',
        'edición de video IA',
      ],
    },
  },
};
