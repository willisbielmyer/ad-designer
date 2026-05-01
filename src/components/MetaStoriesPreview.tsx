import type { MetaAd } from '../types/ads';
import { CTA_LABELS } from '../platforms/meta';

interface Props {
  ad: MetaAd;
}

export function MetaStoriesPreview({ ad }: Props) {
  const cta = CTA_LABELS[ad.ctaButton] || 'Learn More';
  const pageName = ad.campaignName || 'Your Business';
  const overlayText = ad.primaryText || '';
  const headline = ad.headline || '';

  return (
    <div className="preview-wrapper">
      <div className="preview-label">Stories / Reels Preview</div>

      {/* Phone frame */}
      <div className="phone-frame">
        <div className="phone-notch" />

        <div className="stories-screen">
          {/* Progress bars */}
          <div className="stories-progress">
            <div className="stories-bar stories-bar-done" />
            <div className="stories-bar stories-bar-active">
              <div className="stories-bar-fill" />
            </div>
            <div className="stories-bar" />
          </div>

          {/* Header */}
          <div className="stories-header">
            <div className="stories-avatar">
              {pageName.charAt(0).toUpperCase()}
            </div>
            <div className="stories-page-info">
              <div className="stories-page-name">{pageName}</div>
              <div className="stories-sponsored">Sponsored</div>
            </div>
            <div className="stories-more">✕</div>
          </div>

          {/* Background */}
          <div className="stories-bg">
            {ad.generatedImageUrl ? (
              <img src={ad.generatedImageUrl} alt="Ad creative" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect width="64" height="64" rx="6" fill="#4a4f5a"/>
                  <path d="M12 50l14-18 10 12 8-10 14 16H12z" fill="#6b7280"/>
                  <circle cx="44" cy="22" r="8" fill="#6b7280"/>
                </svg>
                {ad.imageDescription && (
                  <div className="stories-bg-hint">"{ad.imageDescription}"</div>
                )}
                <div className="stories-bg-spec">1080 × 1920 px</div>
              </>
            )}
          </div>

          {/* Overlay text */}
          {overlayText && (
            <div className="stories-overlay-text">{overlayText}</div>
          )}

          {/* CTA bar */}
          <div className="stories-cta-bar">
            <div className="stories-cta-swipe">↑ Swipe up</div>
            <div className="stories-cta-content">
              <div className="stories-cta-headline">{headline || cta}</div>
              <button className="stories-cta-btn">{cta}</button>
            </div>
          </div>
        </div>

        <div className="phone-home-bar" />
      </div>

      {/* Reels variant note */}
      <div className="stories-reels-note">
        <span className="note-icon">ℹ</span>
        Reels ads use the same 9:16 vertical spec. Add captions if using video — 85% of Reels are watched without sound.
      </div>

      {/* Spec chips */}
      <div className="preview-specs">
        {ad.dailyBudget && <span className="spec-chip">Budget: ${ad.dailyBudget}/day</span>}
        {ad.locationTargeting && <span className="spec-chip">📍 {ad.locationTargeting}</span>}
        <span className="spec-chip">Ages {ad.ageMin}–{ad.ageMax}</span>
        <span className="spec-chip">9:16 vertical</span>
      </div>
    </div>
  );
}
