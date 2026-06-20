import OpenAI from 'openai';

let _gemini: OpenAI | null = null;

function getGemini(): OpenAI {
  if (!_gemini) {
    _gemini = new OpenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }
  return _gemini;
}

const MODEL = 'gemini-2.0-flash-lite';

export async function generateSpeechText(prompt: string): Promise<string> {
  const systemPrompt = `You are a professional voice-over and speech text writer. Generate clear, engaging text suitable for text-to-speech applications.

Guidelines:
- Write natural, conversational text that sounds good when spoken aloud
- Avoid complex punctuation or formatting that might confuse TTS systems
- Use appropriate pacing with sentence breaks
- Match the tone and style requested by the user
- Detect the language of the user's prompt and write in the SAME language
- Keep the text concise but complete (typically 1-3 paragraphs)
- Avoid overly long sentences

Always respond with valid JSON in this format:
{
  "text": "The generated speech/voice-over text..."
}`;

  const userPrompt = `Write speech/voice-over text based on this description:
${prompt}

Create text that would sound natural and engaging when read aloud by a text-to-speech system.`;

  const response = await getGemini().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content);
  return parsed.text || '';
}

export async function generateVideoPrompt(prompt: string): Promise<string> {
  const systemPrompt = `You are a video prompt expert for AI video generation systems. Create detailed, effective prompts based on user ideas.

Guidelines:
- Create a comprehensive video generation prompt that includes:
  - Subject/scene description (what is happening, who/what is in the frame)
  - Setting/environment (location, time of day, weather, atmosphere)
  - Camera movement/angle (static, panning, tracking, aerial, close-up, wide shot, etc.)
  - Lighting and mood (natural light, dramatic, soft, golden hour, etc.)
  - Visual style (cinematic, documentary, artistic, realistic, etc.)
  - Motion details (how subjects move, speed, direction)
- Keep the prompt clear and descriptive, max 300 words
- Detect the language of the user's input and write the prompt in the SAME language
- Make it specific enough for AI to generate a coherent video
- Focus on visual elements that translate well to video

Always respond with valid JSON in this format:
{
  "prompt": "The complete video generation prompt..."
}`;

  const userPrompt = `Based on this idea, create a detailed video generation prompt:
${prompt}

Expand this into a comprehensive prompt that an AI video generator can use to create a visually stunning video.`;

  const response = await getGemini().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content);
  return parsed.prompt || '';
}

export async function generateImagePrompt(prompt: string, maxLength: number = 800): Promise<string> {
  const systemPrompt = `You are an expert AI image prompt engineer. Create detailed, effective prompts for AI image generation systems like Stable Diffusion, Midjourney, and DALL-E.

Guidelines:
- Create a comprehensive image generation prompt that includes:
  - Main subject description (what is the focus of the image)
  - Setting/environment (location, background, context)
  - Style and aesthetics (art style, artistic medium, visual approach)
  - Lighting and atmosphere (natural light, dramatic, soft, golden hour, etc.)
  - Color palette and mood (warm, cool, vibrant, muted, etc.)
  - Composition hints (close-up, wide shot, centered, rule of thirds)
  - Quality modifiers (highly detailed, professional, 8k, masterpiece, etc.)
- IMPORTANT: Keep the prompt under ${maxLength} characters total
- Detect the language of the user's input and write the prompt in the SAME language
- Focus on visual elements that translate well to static images
- Avoid including text or words to render in the image
- Make it specific enough for AI to generate a coherent, beautiful image

Always respond with valid JSON in this format:
{
  "prompt": "The complete image generation prompt (must be under ${maxLength} characters)..."
}`;

  const userPrompt = `Based on this idea, create a detailed image generation prompt:
${prompt}

Expand this into a comprehensive prompt that an AI image generator can use to create a stunning, high-quality image. Remember: the prompt MUST be under ${maxLength} characters.`;

  const response = await getGemini().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Gemini');

  const parsed = JSON.parse(content);
  return parsed.prompt || '';
}
