export interface AiMusicLocaleContent {
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

export const AI_MUSIC_CONTENT: Record<string, AiMusicLocaleContent> = {
  en: {
    hero: {
      title: 'AI Music Generator — Create Original Songs in Seconds',
      subtitle:
        'Describe your idea or paste lyrics, and AI composes a full song with vocals, instruments, and studio-quality production. 100% royalty-free.',
    },
    features: [
      {
        title: 'Two Creation Modes',
        description:
          'Prompt to Music: describe a mood or scene and get a complete track. Lyrics to Music: paste your own lyrics and choose a style — AI handles the rest.',
      },
      {
        title: 'AI Vocals & Instrumentals',
        description:
          'Generate songs with natural AI singing voices — male, female, or auto-detected. Or toggle instrumental mode for background music without vocals.',
      },
      {
        title: 'Multiple AI Models',
        description:
          'Choose from Music 5.0, 4.5 Plus, and 4.5 — each offering different sound qualities. The latest model delivers delicate human-like vocals and superior production.',
      },
      {
        title: 'AI Lyrics & Style Assistant',
        description:
          'Stuck on words? AI generates creative lyrics from a brief description. The Style Assistant suggests genre tags like pop, jazz, electronic, or cinematic.',
      },
      {
        title: 'Dual Track Output',
        description:
          'Every generation produces two unique versions of your song. Compare and pick the one you love, or use both for different projects.',
      },
      {
        title: '100% Royalty-Free',
        description:
          'All generated music is yours to use — YouTube videos, podcasts, games, ads, or commercial projects. No licensing fees, no copyright strikes.',
      },
    ],
    cta: {
      title: 'Start Creating AI Music Now',
      buttonText: 'Try Free AI Music Generator',
    },
    seoText:
      'Voicica AI Music Generator turns your ideas into complete songs in seconds. Whether you need background music for YouTube videos, original tracks for podcasts, cinematic scores for films, or catchy tunes for social media — our AI composes, sings, and produces studio-quality music from a simple text prompt or your own lyrics. Powered by state-of-the-art neural networks, Voicica supports songs up to 8 minutes with natural AI vocals in multiple languages. Free credits every day — no musical experience required.',
    metadata: {
      title: 'AI Music Generator — Create Songs from Text | Voicica AI',
      description:
        'Generate original AI music from text prompts or lyrics. Full songs with AI vocals, instrumentals, and studio production. Free, royalty-free music creator.',
      keywords: [
        'AI music generator',
        'AI song maker',
        'text to music',
        'AI composer',
        'royalty free music',
        'AI vocals',
        'music generator free',
        'AI lyrics generator',
      ],
    },
  },
  ja: {
    hero: {
      title: 'AI音楽ジェネレーター — 数秒でオリジナル曲を作成',
      subtitle:
        'アイデアを説明するか歌詞を貼り付けるだけで、AIがボーカル、楽器、スタジオ品質のプロダクションで完全な楽曲を作曲します。100%ロイヤリティフリー。',
    },
    features: [
      {
        title: '2つの作成モード',
        description:
          'プロンプトから音楽：ムードやシーンを説明して完全なトラックを取得。歌詞から音楽：自分の歌詞を貼り付けてスタイルを選択 — AIが残りを処理します。',
      },
      {
        title: 'AIボーカル＆インストゥルメンタル',
        description:
          '自然なAI歌声で楽曲を生成 — 男性、女性、または自動検出。インストゥルメンタルモードに切り替えて、ボーカルなしのBGMも作成可能。',
      },
      {
        title: '複数のAIモデル',
        description:
          'Music 5.0、4.5 Plus、4.5から選択 — それぞれ異なるサウンド品質を提供。最新モデルは繊細な人間らしいボーカルと優れたプロダクションを実現。',
      },
      {
        title: 'AI歌詞＆スタイルアシスタント',
        description:
          '歌詞に困ったら？AIが簡単な説明からクリエイティブな歌詞を生成。スタイルアシスタントがポップ、ジャズ、エレクトロニック、シネマティックなどのジャンルタグを提案。',
      },
      {
        title: 'デュアルトラック出力',
        description:
          '毎回の生成で楽曲の2つのユニークなバージョンを作成。比較してお気に入りを選ぶか、異なるプロジェクトで両方を使用できます。',
      },
      {
        title: '100%ロイヤリティフリー',
        description:
          '生成された音楽はすべてあなたのもの — YouTube動画、ポッドキャスト、ゲーム、広告、商用プロジェクトに使用可能。ライセンス料なし、著作権問題なし。',
      },
    ],
    cta: {
      title: '今すぐAI音楽を作成',
      buttonText: '無料AI音楽ジェネレーターを試す',
    },
    seoText:
      'Voicica AI音楽ジェネレーターは、あなたのアイデアを数秒で完全な楽曲に変えます。YouTube動画のBGM、ポッドキャストのオリジナルトラック、映画のシネマティックスコア、SNS用のキャッチーなチューンなど — AIがシンプルなテキストプロンプトやあなたの歌詞からスタジオ品質の音楽を作曲、歌唱、プロデュースします。最先端のニューラルネットワーク技術により、複数言語の自然なAIボーカルで最大8分の楽曲をサポート。毎日無料クレジット — 音楽経験は不要です。',
    metadata: {
      title: 'AI音楽ジェネレーター — テキストから楽曲作成 | Voicica AI',
      description:
        'テキストプロンプトや歌詞からオリジナルAI音楽を生成。AIボーカル、インストゥルメンタル、スタジオプロダクション付きの完全な楽曲。無料ロイヤリティフリー音楽クリエイター。',
      keywords: [
        'AI音楽ジェネレーター',
        'AI作曲',
        'テキストから音楽',
        'AI作曲家',
        'ロイヤリティフリー音楽',
        'AIボーカル',
        '無料音楽生成',
        'AI歌詞生成',
      ],
    },
  },
  'zh-Hant': {
    hero: {
      title: 'AI音樂生成器 — 數秒內創作原創歌曲',
      subtitle:
        '描述你的想法或貼上歌詞，AI就能譜出包含人聲、樂器和錄音室品質製作的完整歌曲。100%免版稅。',
    },
    features: [
      {
        title: '兩種創作模式',
        description:
          '提示詞生成音樂：描述氛圍或場景，獲得完整曲目。歌詞生成音樂：貼上你的歌詞並選擇風格——AI負責完成其餘工作。',
      },
      {
        title: 'AI人聲與純音樂',
        description:
          '以自然的AI歌聲生成歌曲——男聲、女聲或自動偵測。也可切換純音樂模式，創作無人聲的背景音樂。',
      },
      {
        title: '多種AI模型',
        description:
          '從Music 5.0、4.5 Plus和4.5中選擇——各提供不同音質。最新模型呈現細膩的擬人歌聲與卓越製作品質。',
      },
      {
        title: 'AI歌詞與風格助手',
        description:
          '寫詞卡關？AI從簡短描述生成創意歌詞。風格助手建議流行、爵士、電子、電影配樂等曲風標籤。',
      },
      {
        title: '雙軌輸出',
        description:
          '每次生成都會產出兩個獨特版本的歌曲。比較並選出你最愛的，或在不同專案中同時使用。',
      },
      {
        title: '100%免版稅',
        description:
          '所有生成的音樂都歸你所有——YouTube影片、Podcast、遊戲、廣告或商業專案均可使用。無授權費、無版權問題。',
      },
    ],
    cta: {
      title: '立即開始創作AI音樂',
      buttonText: '免費試用AI音樂生成器',
    },
    seoText:
      'Voicica AI音樂生成器能在數秒內將你的想法化為完整歌曲。無論你需要YouTube影片的背景音樂、Podcast的原創曲目、電影的配樂、還是社群媒體的洗腦旋律——我們的AI能從簡單的文字提示或你的歌詞中作曲、演唱並製作錄音室品質的音樂。採用最先進的神經網路技術，Voicica支援多語言自然AI人聲，歌曲長度可達8分鐘。每天免費額度——無需音樂經驗。',
    metadata: {
      title: 'AI音樂生成器 — 從文字創作歌曲 | Voicica AI',
      description:
        '從文字提示或歌詞生成原創AI音樂。包含AI人聲、純音樂和錄音室製作的完整歌曲。免費免版稅音樂創作工具。',
      keywords: [
        'AI音樂生成器',
        'AI作曲',
        '文字轉音樂',
        'AI作曲家',
        '免版稅音樂',
        'AI人聲',
        '免費音樂生成',
        'AI歌詞生成',
      ],
    },
  },
  ko: {
    hero: {
      title: 'AI 음악 생성기 — 몇 초 만에 오리지널 곡 만들기',
      subtitle:
        '아이디어를 설명하거나 가사를 붙여넣으면, AI가 보컬, 악기, 스튜디오급 프로덕션이 포함된 완전한 곡을 작곡합니다. 100% 로열티 프리.',
    },
    features: [
      {
        title: '두 가지 제작 모드',
        description:
          '프롬프트로 음악: 분위기나 장면을 설명하면 완전한 트랙을 받으세요. 가사로 음악: 가사를 붙여넣고 스타일을 선택하면 — AI가 나머지를 처리합니다.',
      },
      {
        title: 'AI 보컬 & 인스트루멘탈',
        description:
          '자연스러운 AI 노래 목소리로 곡을 생성 — 남성, 여성 또는 자동 감지. 인스트루멘탈 모드로 전환하면 보컬 없는 배경 음악도 만들 수 있습니다.',
      },
      {
        title: '다양한 AI 모델',
        description:
          'Music 5.0, 4.5 Plus, 4.5 중 선택 — 각각 다른 사운드 품질을 제공합니다. 최신 모델은 섬세한 인간 같은 보컬과 우수한 프로덕션을 제공합니다.',
      },
      {
        title: 'AI 가사 & 스타일 어시스턴트',
        description:
          '가사 작성에 막혔나요? AI가 간단한 설명에서 창의적인 가사를 생성합니다. 스타일 어시스턴트가 팝, 재즈, 일렉트로닉, 시네마틱 등의 장르 태그를 제안합니다.',
      },
      {
        title: '듀얼 트랙 출력',
        description:
          '매번 생성할 때마다 곡의 두 가지 고유한 버전을 만듭니다. 비교해서 마음에 드는 것을 고르거나, 다른 프로젝트에서 둘 다 사용하세요.',
      },
      {
        title: '100% 로열티 프리',
        description:
          '생성된 모든 음악은 당신의 것 — YouTube 영상, 팟캐스트, 게임, 광고, 상업 프로젝트에 사용 가능. 라이선스 비용 없음, 저작권 문제 없음.',
      },
    ],
    cta: {
      title: '지금 AI 음악 만들기 시작',
      buttonText: '무료 AI 음악 생성기 체험',
    },
    seoText:
      'Voicica AI 음악 생성기는 당신의 아이디어를 몇 초 만에 완전한 곡으로 바꿔줍니다. YouTube 영상의 배경 음악, 팟캐스트의 오리지널 트랙, 영화의 시네마틱 스코어, 소셜 미디어의 중독성 있는 멜로디가 필요하든 — AI가 간단한 텍스트 프롬프트나 가사에서 스튜디오 품질의 음악을 작곡, 노래, 프로듀싱합니다. 최첨단 신경망 기술로 구동되며, 다국어 자연스러운 AI 보컬로 최대 8분 길이의 곡을 지원합니다.',
    metadata: {
      title: 'AI 음악 생성기 — 텍스트로 곡 만들기 | Voicica AI',
      description:
        '텍스트 프롬프트나 가사에서 오리지널 AI 음악을 생성하세요. AI 보컬, 인스트루멘탈, 스튜디오 프로덕션이 포함된 완전한 곡. 무료 로열티 프리 음악 크리에이터.',
      keywords: [
        'AI 음악 생성기',
        'AI 작곡',
        '텍스트 투 뮤직',
        'AI 작곡가',
        '로열티 프리 음악',
        'AI 보컬',
        '무료 음악 생성',
        'AI 가사 생성',
      ],
    },
  },
  th: {
    hero: {
      title: 'AI สร้างเพลง — สร้างเพลงต้นฉบับในไม่กี่วินาที',
      subtitle:
        'อธิบายไอเดียหรือวางเนื้อเพลง แล้ว AI จะแต่งเพลงเต็มรูปแบบพร้อมเสียงร้อง เครื่องดนตรี และการผลิตคุณภาพสตูดิโอ ปลอดค่าลิขสิทธิ์ 100%',
    },
    features: [
      {
        title: 'สองโหมดสร้างสรรค์',
        description:
          'พรอมต์สู่เพลง: อธิบายอารมณ์หรือฉากเพื่อรับแทร็กเต็ม เนื้อเพลงสู่เพลง: วางเนื้อเพลงของคุณแล้วเลือกสไตล์ — AI จัดการที่เหลือ',
      },
      {
        title: 'เสียงร้อง AI และดนตรีบรรเลง',
        description:
          'สร้างเพลงด้วยเสียงร้อง AI ที่เป็นธรรมชาติ — ชาย หญิง หรือตรวจจับอัตโนมัติ สลับเป็นโหมดดนตรีบรรเลงเพื่อสร้างเพลงประกอบไม่มีเสียงร้อง',
      },
      {
        title: 'หลายโมเดล AI',
        description:
          'เลือกจาก Music 5.0, 4.5 Plus และ 4.5 — แต่ละตัวให้คุณภาพเสียงที่แตกต่าง โมเดลล่าสุดให้เสียงร้องเหมือนมนุษย์ที่ละเอียดและการผลิตที่เหนือชั้น',
      },
      {
        title: 'ผู้ช่วย AI เนื้อเพลงและสไตล์',
        description:
          'ติดเรื่องเนื้อเพลง? AI สร้างเนื้อเพลงสร้างสรรค์จากคำอธิบายสั้นๆ ผู้ช่วยสไตล์แนะนำแท็กแนวเพลง เช่น ป็อป แจ๊ส อิเล็กทรอนิกส์ หรือซีเนมาติก',
      },
      {
        title: 'เอาต์พุตสองแทร็ก',
        description:
          'ทุกครั้งที่สร้างจะได้เพลงสองเวอร์ชันที่ไม่ซ้ำกัน เปรียบเทียบแล้วเลือกเวอร์ชันที่ชอบ หรือใช้ทั้งสองในโปรเจกต์ต่างกัน',
      },
      {
        title: 'ปลอดค่าลิขสิทธิ์ 100%',
        description:
          'เพลงที่สร้างทั้งหมดเป็นของคุณ — วิดีโอ YouTube พอดแคสต์ เกม โฆษณา หรือโปรเจกต์เชิงพาณิชย์ ไม่มีค่าลิขสิทธิ์ ไม่มีปัญหาลิขสิทธิ์',
      },
    ],
    cta: {
      title: 'เริ่มสร้างเพลง AI เลย',
      buttonText: 'ลองเครื่องสร้างเพลง AI ฟรี',
    },
    seoText:
      'Voicica AI สร้างเพลง เปลี่ยนไอเดียของคุณเป็นเพลงเต็มรูปแบบในไม่กี่วินาที ไม่ว่าคุณจะต้องการเพลงประกอบสำหรับ YouTube พอดแคสต์ สกอร์ภาพยนตร์ หรือทำนองติดหูสำหรับโซเชียลมีเดีย — AI ของเราแต่ง ร้อง และผลิตเพลงคุณภาพสตูดิโอจากข้อความง่ายๆ หรือเนื้อเพลงของคุณ ขับเคลื่อนด้วยเทคโนโลยีเครือข่ายประสาทเทียมล้ำสมัย รองรับเพลงยาวสูงสุด 8 นาทีพร้อมเสียงร้อง AI หลายภาษา',
    metadata: {
      title: 'AI สร้างเพลง — สร้างเพลงจากข้อความ | Voicica AI',
      description:
        'สร้างเพลง AI ต้นฉบับจากข้อความหรือเนื้อเพลง เพลงเต็มพร้อมเสียงร้อง AI ดนตรีบรรเลง และการผลิตสตูดิโอ เครื่องสร้างเพลงฟรีปลอดค่าลิขสิทธิ์',
      keywords: [
        'AI สร้างเพลง',
        'AI แต่งเพลง',
        'ข้อความเป็นเพลง',
        'AI นักแต่งเพลง',
        'เพลงปลอดค่าลิขสิทธิ์',
        'AI เสียงร้อง',
        'สร้างเพลงฟรี',
        'AI สร้างเนื้อเพลง',
      ],
    },
  },
  es: {
    hero: {
      title: 'Generador de Música IA — Crea Canciones Originales en Segundos',
      subtitle:
        'Describe tu idea o pega letras, y la IA compone una canción completa con voces, instrumentos y producción de calidad de estudio. 100% libre de regalías.',
    },
    features: [
      {
        title: 'Dos Modos de Creación',
        description:
          'Prompt a Música: describe un ambiente o escena y obtén una pista completa. Letra a Música: pega tus propias letras y elige un estilo — la IA se encarga del resto.',
      },
      {
        title: 'Voces IA e Instrumentales',
        description:
          'Genera canciones con voces cantantes IA naturales — masculina, femenina o detección automática. O activa el modo instrumental para música de fondo sin voces.',
      },
      {
        title: 'Múltiples Modelos IA',
        description:
          'Elige entre Music 5.0, 4.5 Plus y 4.5 — cada uno ofrece diferentes calidades de sonido. El modelo más reciente ofrece voces humanas delicadas y producción superior.',
      },
      {
        title: 'Asistente de Letras y Estilo IA',
        description:
          '¿Bloqueado con las palabras? La IA genera letras creativas a partir de una breve descripción. El Asistente de Estilo sugiere etiquetas de género como pop, jazz, electrónica o cinematográfica.',
      },
      {
        title: 'Salida de Doble Pista',
        description:
          'Cada generación produce dos versiones únicas de tu canción. Compara y elige la que más te guste, o usa ambas para diferentes proyectos.',
      },
      {
        title: '100% Libre de Regalías',
        description:
          'Toda la música generada es tuya — videos de YouTube, podcasts, juegos, anuncios o proyectos comerciales. Sin tarifas de licencia, sin problemas de derechos de autor.',
      },
    ],
    cta: {
      title: 'Empieza a Crear Música IA Ahora',
      buttonText: 'Prueba el Generador de Música IA Gratis',
    },
    seoText:
      'Voicica Generador de Música IA convierte tus ideas en canciones completas en segundos. Ya sea que necesites música de fondo para videos de YouTube, pistas originales para podcasts, bandas sonoras cinematográficas para películas o melodías pegadizas para redes sociales — nuestra IA compone, canta y produce música de calidad de estudio a partir de un simple texto o tus propias letras. Impulsado por redes neuronales de última generación, Voicica soporta canciones de hasta 8 minutos con voces IA naturales en múltiples idiomas. Créditos gratis cada día — no se requiere experiencia musical.',
    metadata: {
      title: 'Generador de Música IA — Crea Canciones desde Texto | Voicica AI',
      description:
        'Genera música IA original a partir de textos o letras. Canciones completas con voces IA, instrumentales y producción de estudio. Creador de música gratis y libre de regalías.',
      keywords: [
        'generador de música IA',
        'creador de canciones IA',
        'texto a música',
        'compositor IA',
        'música libre de regalías',
        'voces IA',
        'generador de música gratis',
        'generador de letras IA',
      ],
    },
  },
};
