import { useState } from 'react';
import { generateImage } from '../utils/generateImage';

interface Props {
  platform: string;
  format: string;
  initialDescription?: string;
  onGenerated: (imageUrl: string) => void;
}

export function ImageGenerator({ platform, format, initialDescription = '', onGenerated }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!description.trim()) return;
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const result = await generateImage({ description, platform, format });
      setImageUrl(result.imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleUse() {
    onGenerated(imageUrl);
    setOpen(false);
  }

  return (
    <div className="image-generator">
      <button
        type="button"
        className="ig-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span>🖼</span>
        <span>Generate Image with AI</span>
        <span className="ca-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="ig-body">
          <div className="field-group" style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>Describe the image you want</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Smiling plumber fixing a kitchen sink in a modern home, professional and trustworthy"
              rows={2}
              className="ca-textarea"
            />
          </div>

          <button
            type="button"
            className="ig-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
          >
            {loading ? (
              <><span className="ca-spinner" />Generating…</>
            ) : (
              imageUrl ? 'Regenerate' : 'Generate Image'
            )}
          </button>

          {error && (
            <div className="ca-error" style={{ marginTop: 8 }}>
              {error.includes('OPENAI_API_KEY')
                ? '⚠ Add your OPENAI_API_KEY to Vercel environment variables.'
                : `Error: ${error}`}
            </div>
          )}

          {imageUrl && (
            <div className="ig-result">
              <img src={imageUrl} alt="Generated ad" className="ig-preview-img" />
              <div className="ig-result-actions">
                <button type="button" className="ig-use-btn" onClick={handleUse}>
                  ✓ Use this image
                </button>
                <a href={imageUrl} download="ad-image.png" target="_blank" rel="noreferrer" className="ig-download-btn">
                  ↓ Download
                </a>
              </div>
              <p className="ig-note">Images expire after 1 hour — download before closing.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
