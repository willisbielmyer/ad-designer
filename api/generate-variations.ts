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
    const { ad } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildVariationsPrompt(ad) }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { variations: [] };

    return res.json(result);
  } catch (err) {
    console.error('[generate-variations]', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Generation failed' });
  }
}

function buildVariationsPrompt(ad: any): string {
  const platform = ad.platform;
  const format = ad.format || '';

  let currentCopy = '';
  let copyFields = '';

  if (platform === 'google' && format === 'search') {
    currentCopy = `Headlines: ${ad.headlines?.join(' | ')}\nDescriptions: ${ad.descriptions?.join(' | ')}`;
    copyFields = `"headlines": ["h1","h2","h3"], "descriptions": ["d1","d2"]`;
  } else if (platform === 'google' && format === 'display') {
    currentCopy = `Short headlines: ${ad.shortHeadlines?.join(' | ')}\nLong headline: ${ad.longHeadline}\nDescriptions: ${ad.descriptions?.join(' | ')}`;
    copyFields = `"shortHeadlines": ["h1","h2","h3","h4","h5"], "longHeadline": "...", "descriptions": ["d1","d2"]`;
  } else if (platform === 'meta') {
    currentCopy = `Primary text: ${ad.primaryText}\nHeadline: ${ad.headline}`;
    copyFields = `"primaryText": "...", "headline": "..."`;
  } else if (platform === 'tiktok') {
    currentCopy = `Caption: ${ad.caption}\nHashtags: ${ad.hashtags}`;
    copyFields = `"caption": "...", "hashtags": "..."`;
  }

  const charLimits = platform === 'google' && format === 'search'
    ? 'Headlines: max 30 chars each. Descriptions: max 90 chars each.'
    : platform === 'google' && format === 'display'
    ? 'Short headlines: max 30 chars. Long headline: max 90 chars. Descriptions: max 90 chars.'
    : platform === 'meta'
    ? 'Primary text: max 125 chars. Headline: max 27 chars.'
    : platform === 'tiktok'
    ? 'Caption: max 100 chars.'
    : '';

  return `You are an expert ad copywriter. Generate 2 A/B test variations of this ad with distinctly different angles.

Platform: ${platform}${format ? ` (${format})` : ''}
Campaign goal: ${ad.goal}
Current copy:
${currentCopy}

Return ONLY valid JSON — no other text:
{
  "variations": [
    {
      "label": "Variation A: [angle name, e.g. Urgency / Benefit / Trust / Question]",
      "rationale": "One sentence: what strategy this uses and why it might outperform the original",
      ${copyFields}
    },
    {
      "label": "Variation B: [different angle name]",
      "rationale": "One sentence: what strategy this uses and why it might outperform Variation A",
      ${copyFields}
    }
  ]
}

Rules:
- ${charLimits}
- Make variations MEANINGFULLY different — different hooks, angles, CTAs, not just word swaps
- Variation A and B should each take a completely different psychological approach
- Keep the same language/tone level as the original (if original is casual, keep casual)`;
}
