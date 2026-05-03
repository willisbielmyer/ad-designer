import type { AnyAd } from '../types/ads';

export interface Variation {
  label: string;
  rationale: string;
  fields: Record<string, any>;
}

export interface VariationsResult {
  variations: Variation[];
}

export async function generateVariations(ad: AnyAd): Promise<VariationsResult> {
  const res = await fetch('/api/generate-variations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ad }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const result = await res.json();
  if (!Array.isArray(result.variations)) {
    throw new Error('Invalid response from server. Please try again.');
  }
  return result;
}
