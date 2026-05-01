import { useState } from 'react';
import { generateCopy, type CopySuggestions } from '../utils/generateCopy';

interface Props {
  platform: 'google' | 'meta' | 'tiktok';
  format: string;
  goal: string;
  keywords?: string;
  onApply: (field: string, slotIndex: number, value: string) => void;
}

export function CopyAssistant({ platform, format, goal, keywords, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CopySuggestions | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!desc.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const data = await generateCopy({ platform, format, goal, businessDescription: desc, keywords });
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  const isGoogleSearch = platform === 'google' && format === 'search';
  const isGoogleDisplay = platform === 'google' && format === 'display';
  const isMetaFeed = platform === 'meta' && format === 'feed';
  const isMetaStories = platform === 'meta' && format === 'stories_reels';
  const isTikTok = platform === 'tiktok';

  return (
    <div className="copy-assistant">
      <button
        type="button"
        className="ca-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ca-sparkle">✨</span>
        <span>AI Copy Assistant</span>
        <span className="ca-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="ca-body">
          <div className="field-group" style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>Describe your business &amp; offer</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. We're a local plumbing company in Denver offering 24/7 emergency repairs with a 1-hour response guarantee and upfront pricing."
              rows={3}
              className="ca-textarea"
            />
          </div>

          <button
            type="button"
            className="ca-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !desc.trim()}
          >
            {loading ? (
              <>
                <span className="ca-spinner" />
                Generating…
              </>
            ) : (
              'Generate Copy Ideas'
            )}
          </button>

          {error && (
            <div className="ca-error">
              {error.includes('ANTHROPIC_API_KEY') || error.includes('not configured')
                ? '⚠ Add your ANTHROPIC_API_KEY to the .env file and restart the dev server.'
                : `Error: ${error}`}
            </div>
          )}

          {results && (
            <div className="ca-results">
              {/* Google Search / Display short headlines */}
              {(results.headlines || results.shortHeadlines) && (
                <div className="ca-section">
                  <div className="ca-section-label">
                    {isGoogleDisplay ? 'Short Headlines (30 chars)' : 'Headlines (30 chars)'}
                  </div>
                  {(results.shortHeadlines ?? results.headlines ?? []).map((h, i) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{h}</span>
                      <span className="ca-char-hint">{h.length}/30</span>
                      <div className="ca-apply-btns">
                        {isGoogleSearch && (
                          <>
                            <button type="button" className="ca-apply-btn" onClick={() => onApply('headline', 0, h)}>H1</button>
                            <button type="button" className="ca-apply-btn" onClick={() => onApply('headline', 1, h)}>H2</button>
                            <button type="button" className="ca-apply-btn" onClick={() => onApply('headline', 2, h)}>H3</button>
                          </>
                        )}
                        {isGoogleDisplay && (
                          <>
                            {[0, 1, 2, 3, 4].map((slot) => (
                              <button key={slot} type="button" className="ca-apply-btn" onClick={() => onApply('shortHeadline', slot, h)}>
                                H{slot + 1}
                              </button>
                            ))}
                          </>
                        )}
                        {(isMetaFeed || isMetaStories) && (
                          <button type="button" className="ca-apply-btn" onClick={() => onApply('headline', 0, h)}>→ Apply</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Google Display long headline */}
              {results.longHeadline && (
                <div className="ca-section">
                  <div className="ca-section-label">Long Headline (90 chars)</div>
                  <div className="ca-suggestion">
                    <span className="ca-suggestion-text">{results.longHeadline}</span>
                    <span className="ca-char-hint">{results.longHeadline.length}/90</span>
                    <div className="ca-apply-btns">
                      <button type="button" className="ca-apply-btn" onClick={() => onApply('longHeadline', 0, results.longHeadline!)}>→ Apply</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Descriptions */}
              {results.descriptions && (
                <div className="ca-section">
                  <div className="ca-section-label">Descriptions (90 chars)</div>
                  {results.descriptions.map((d, i) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{d}</span>
                      <span className="ca-char-hint">{d.length}/90</span>
                      <div className="ca-apply-btns">
                        {(isGoogleSearch || isGoogleDisplay) && (
                          <>
                            <button type="button" className="ca-apply-btn" onClick={() => onApply('description', 0, d)}>D1</button>
                            <button type="button" className="ca-apply-btn" onClick={() => onApply('description', 1, d)}>D2</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Meta primary texts */}
              {results.primaryTexts && (
                <div className="ca-section">
                  <div className="ca-section-label">Primary Text (125 chars)</div>
                  {results.primaryTexts.map((pt, i) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{pt}</span>
                      <span className="ca-char-hint">{pt.length}/125</span>
                      <div className="ca-apply-btns">
                        <button type="button" className="ca-apply-btn" onClick={() => onApply('primaryText', 0, pt)}>→ Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Meta Stories overlay texts */}
              {results.overlayTexts && (
                <div className="ca-section">
                  <div className="ca-section-label">Text Overlay</div>
                  {results.overlayTexts.map((ot, i) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{ot}</span>
                      <span className="ca-char-hint">{ot.length} chars</span>
                      <div className="ca-apply-btns">
                        <button type="button" className="ca-apply-btn" onClick={() => onApply('overlayText', 0, ot)}>→ Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TikTok captions */}
              {isTikTok && results.captions && (
                <div className="ca-section">
                  <div className="ca-section-label">Captions (100 chars)</div>
                  {results.captions.map((c: string, i: number) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{c}</span>
                      <span className="ca-char-hint">{c.length}/100</span>
                      <div className="ca-apply-btns">
                        <button type="button" className="ca-apply-btn" onClick={() => onApply('caption', 0, c)}>→ Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TikTok hashtags */}
              {isTikTok && results.hashtags && (
                <div className="ca-section">
                  <div className="ca-section-label">Hashtag Sets</div>
                  {results.hashtags.map((h: string, i: number) => (
                    <div key={i} className="ca-suggestion">
                      <span className="ca-suggestion-text">{h}</span>
                      <div className="ca-apply-btns">
                        <button type="button" className="ca-apply-btn" onClick={() => onApply('hashtags', 0, h)}>→ Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
