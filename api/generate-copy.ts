import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(params) }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return res.json(result);
  } catch (err) {
    console.error('[generate-copy]', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Generation failed' });
  }
}

function buildPrompt(params: {
  platform: string;
  format: string;
  goal: string;
  businessDescription: string;
  keywords?: string;
}): string {
  const { platform, format, goal, businessDescription, keywords } = params;

  if (platform === 'google' && format === 'search') {
    return `You are an expert Google Ads copywriter. Generate ad copy for a Google Search campaign.

Business: ${businessDescription}
Campaign goal: ${goal}
${keywords ? `Keywords: ${keywords.slice(0, 200)}` : ''}

Return ONLY a valid JSON object with no extra text:
{
  "headlines": ["h1", "h2", "h3", "h4", "h5"],
  "descriptions": ["d1", "d2", "d3"]
}

Rules:
- Headlines: max 30 characters each, punchy and benefit-focused
- Descriptions: max 90 characters each, end with a call to action
- Vary tone: urgency, benefit, question, social proof
- No exclamation marks in headlines`;
  }

  if (platform === 'google' && format === 'display') {
    return `You are an expert Google Display Ads copywriter. Generate responsive display ad copy.

Business: ${businessDescription}
Campaign goal: ${goal}

Return ONLY a valid JSON object:
{
  "shortHeadlines": ["h1", "h2", "h3", "h4", "h5"],
  "longHeadline": "one long headline up to 90 chars",
  "descriptions": ["d1", "d2", "d3"]
}

Rules:
- Short headlines: max 30 characters each, punchy and benefit-focused
- Long headline: max 90 characters, a compelling sentence that stands alone
- Descriptions: max 90 characters each, include a clear call to action
- Each asset should stand alone — Google mixes and matches them`;
  }

  if (platform === 'meta' && format === 'feed') {
    return `You are an expert Meta/Facebook Ads copywriter. Generate feed ad copy.

Business: ${businessDescription}
Campaign goal: ${goal}

Return ONLY a valid JSON object:
{
  "primaryTexts": ["pt1", "pt2", "pt3"],
  "headlines": ["h1", "h2", "h3"]
}

Rules:
- Primary texts: 100–125 characters, hook in the first sentence, scroll-stopping
- Headlines: max 27 characters, punchy CTA or benefit statement
- Vary tone: emotional, direct, question, social proof`;
  }

  if (platform === 'meta' && format === 'stories_reels') {
    return `You are an expert Meta Stories/Reels copywriter. Generate vertical ad copy.

Business: ${businessDescription}
Campaign goal: ${goal}

Return ONLY a valid JSON object:
{
  "overlayTexts": ["ot1", "ot2", "ot3"],
  "headlines": ["h1", "h2", "h3"]
}

Rules:
- Overlay texts: 50–80 characters, bold visual-first text
- Headlines (CTA bar): max 27 characters, clear and urgent
- 85% of Stories are watched without sound — text must stand alone`;
  }

  return `Generate ad copy for: ${businessDescription}. Return JSON: {"headlines": [], "descriptions": []}`;
}
