export interface CopyRequest {
  platform: 'google' | 'meta' | 'tiktok';
  format: string;
  goal: string;
  businessDescription: string;
  keywords?: string;
}

export interface CopySuggestions {
  headlines?: string[];
  shortHeadlines?: string[];
  longHeadline?: string;
  descriptions?: string[];
  primaryTexts?: string[];
  overlayTexts?: string[];
  captions?: string[];
  hashtags?: string[];
}

export async function generateCopy(req: CopyRequest): Promise<CopySuggestions> {
  const res = await fetch('/api/generate-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
