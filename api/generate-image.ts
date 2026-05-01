import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { description, platform, format } = params;

    const size = getImageSize(platform, format);
    const prompt = buildImagePrompt(description, platform, format);

    const client = new OpenAI({ apiKey });
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality: 'standard',
      style: 'natural',
    });

    return res.json({
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    });
  } catch (err) {
    console.error('[generate-image]', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Image generation failed' });
  }
}

function getImageSize(platform: string, format: string): '1024x1024' | '1792x1024' | '1024x1792' {
  if (platform === 'meta' && format === 'stories_reels') return '1024x1792';
  if (platform === 'meta' || platform === 'google') return '1792x1024';
  return '1024x1024';
}

function buildImagePrompt(description: string, platform: string, format: string): string {
  const base = `Professional advertisement photo for: ${description}.`;

  const styleGuide = 'Commercial photography style, bright natural lighting, high quality, visually compelling. Absolutely no text, words, logos, or overlays in the image.';

  if (platform === 'meta' && format === 'stories_reels') {
    return `${base} Vertical portrait composition, 9:16 format, suitable for Instagram Stories or Reels. Bold, eye-catching visual. ${styleGuide}`;
  }
  if (platform === 'meta') {
    return `${base} Horizontal landscape composition, 16:9 format, suitable for Facebook and Instagram feed. Clean and inviting. ${styleGuide}`;
  }
  if (platform === 'google' && format === 'display') {
    return `${base} Clean minimal composition suitable for display advertising. Professional, trustworthy aesthetic. ${styleGuide}`;
  }

  return `${base} ${styleGuide}`;
}
