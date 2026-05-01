export interface ImageRequest {
  description: string;
  platform: string;
  format: string;
}

export interface ImageResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export async function generateImage(req: ImageRequest): Promise<ImageResult> {
  const res = await fetch('/api/generate-image', {
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
