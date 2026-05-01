import { useState } from 'react';
import type { AnyAd } from '../types/ads';
import { generateVariations, type Variation } from '../utils/generateVariations';

interface Props {
  draft: AnyAd | null;
  onLoadVariation: (fields: Record<string, any>) => void;
}

export function ABVariations({ draft, onLoadVariation }: Props) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState<number | null>(null);

  async function handleGenerate() {
    if (!draft) return;
    setLoading(true);
    setError('');
    setVariations([]);
    setLoaded(null);
    try {
      const result = await generateVariations(draft);
      setVariations(result.variations);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleLoad(v: Variation, i: number) {
    onLoadVariation(v.fields);
    setLoaded(i);
  }

  if (!draft) {
    return (
      <div className="preview-empty">
        <div className="preview-empty-icon">🧪</div>
        <p>Fill in your ad form first, then generate A/B variations here.</p>
      </div>
    );
  }

  return (
    <div className="ab-panel">
      <div className="ab-header">
        <div>
          <h3 className="ab-title">A/B Test Variations</h3>
          <p className="ab-subtitle">Generate 2 alternative copy angles to test against your current ad.</p>
        </div>
        <button
          className="ab-generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <><span className="ca-spinner" style={{ borderTopColor: 'white' }} />Generating…</>
          ) : variations.length > 0 ? (
            '↺ Regenerate'
          ) : (
            '✦ Generate Variations'
          )}
        </button>
      </div>

      {error && (
        <div className="ca-error">{error}</div>
      )}

      {variations.length > 0 && (
        <div className="ab-variations">
          {variations.map((v, i) => (
            <div key={i} className={`ab-variation-card ${loaded === i ? 'ab-variation-loaded' : ''}`}>
              <div className="ab-variation-header">
                <span className="ab-variation-label">{v.label}</span>
                {loaded === i && <span className="ab-loaded-badge">✓ Loaded</span>}
              </div>
              <p className="ab-rationale">{v.rationale}</p>

              <div className="ab-fields">
                {Object.entries(v.fields).map(([key, value]) => (
                  <div key={key} className="ab-field">
                    <span className="ab-field-key">{formatFieldName(key)}</span>
                    <span className="ab-field-value">
                      {Array.isArray(value) ? value.join(' · ') : String(value)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="ab-load-btn"
                onClick={() => handleLoad(v, i)}
              >
                {loaded === i ? '✓ Loaded into form' : '→ Load this variation'}
              </button>
            </div>
          ))}
        </div>
      )}

      {variations.length === 0 && !loading && !error && (
        <div className="ab-empty">
          <p>Click "Generate Variations" to get 2 alternative copy angles — Claude will suggest different psychological approaches to A/B test.</p>
        </div>
      )}
    </div>
  );
}

function formatFieldName(key: string): string {
  const map: Record<string, string> = {
    headlines: 'Headlines',
    shortHeadlines: 'Short Headlines',
    longHeadline: 'Long Headline',
    descriptions: 'Descriptions',
    primaryText: 'Primary Text',
    headline: 'Headline',
    caption: 'Caption',
    hashtags: 'Hashtags',
  };
  return map[key] || key;
}
