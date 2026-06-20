import { GoogleGenerativeAI } from '@google/generative-ai';

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_API_KEY 未配置');
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

const MODEL = 'gemini-2.5-flash-lite';

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: 'application/json' },
  });
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

export async function generateSpeechText(prompt: string): Promise<string> {
  const system = `You are a professional voice-over and speech text writer. Generate clear, engaging text suitable for text-to-speech applications.
- Write natural, conversational text that sounds good when spoken aloud
- Avoid complex punctuation or formatting that might confuse TTS systems
- Match the tone and style requested by the user
- Detect the language of the user's prompt and write in the SAME language
- Keep the text concise but complete (typically 1-3 paragraphs)
Respond with valid JSON: { "text": "..." }`;

  const user = `Write speech/voice-over text based on this description:\n${prompt}`;
  const raw = await callGemini(system, user);
  return JSON.parse(raw).text || '';
}

export async function generateVideoPrompt(prompt: string): Promise<string> {
  const system = `You are a video prompt expert for AI video generation systems.
Create a comprehensive video generation prompt including: subject/scene, setting/environment, camera movement/angle, lighting/mood, visual style, motion details.
Keep the prompt under 300 words.
Detect the language of the user's input and write the prompt in the SAME language.
Respond with valid JSON: { "prompt": "..." }`;

  const user = `Based on this idea, create a detailed video generation prompt:\n${prompt}`;
  const raw = await callGemini(system, user);
  return JSON.parse(raw).prompt || '';
}

export async function generateImagePrompt(prompt: string, maxLength: number = 800): Promise<string> {
  const system = `You are an expert AI image prompt engineer for systems like Stable Diffusion, Midjourney, and DALL-E.
Create a comprehensive image generation prompt including: main subject, setting/environment, style/aesthetics, lighting/atmosphere, color palette/mood, composition hints, quality modifiers.
IMPORTANT: Keep the prompt under ${maxLength} characters total.
Detect the language of the user's input and write the prompt in the SAME language.
Respond with valid JSON: { "prompt": "..." }`;

  const user = `Based on this idea, create a detailed image generation prompt (must be under ${maxLength} characters):\n${prompt}`;
  const raw = await callGemini(system, user);
  return JSON.parse(raw).prompt || '';
}
