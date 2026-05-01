import type { GoogleDisplayAd } from '../types/ads';

interface Props {
  ad: GoogleDisplayAd;
}

export function GoogleDisplayPreview({ ad }: Props) {
  const businessName = ad.businessName || 'Your Business';
  const headline = ad.shortHeadlines.find(Boolean) || 'Your Headline Here';
  const longHeadline = ad.longHeadline || 'Your compelling long headline that stands alone';
  const description = ad.descriptions.find(Boolean) || 'Describe your offer and include a call to action.';
  const cta = ad.callToAction === 'Automated' ? 'Learn More' : ad.callToAction;

  return (
    <div className="preview-wrapper">
      <div className="preview-label">Google Display Ad Previews</div>

      {/* 300×250 Medium Rectangle */}
      <div className="preview-label" style={{ fontSize: 10, marginTop: 4 }}>300 × 250 — Medium Rectangle</div>
      <div className="display-ad display-300x250">
        <div className="display-image-area">
          {ad.generatedImageUrl ? (
            <img src={ad.generatedImageUrl} alt="Ad creative" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="3" fill="#c8cdd4" />
                <path d="M6 30l8-10 6 7 4-5 8 8H6z" fill="#9aa3ae" />
                <circle cx="28" cy="12" r="5" fill="#9aa3ae" />
              </svg>
              {ad.imageDescriptions[0] && (
                <div className="display-image-hint">"{ad.imageDescriptions[0]}"</div>
              )}
            </>
          )}
        </div>
        <div className="display-body">
          <div className="display-business-name">{businessName}</div>
          <div className="display-headline">{headline}</div>
          <div className="display-description">{description}</div>
          <button className="display-cta-btn">{cta}</button>
        </div>
      </div>

      {/* 728×90 Leaderboard */}
      <div className="preview-label" style={{ fontSize: 10, marginTop: 8 }}>728 × 90 — Leaderboard</div>
      <div className="display-ad display-leaderboard">
        <div className="display-leaderboard-image">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="2" fill="#c8cdd4" />
            <path d="M4 22l6-8 4 5 3-4 6 7H4z" fill="#9aa3ae" />
            <circle cx="20" cy="8" r="4" fill="#9aa3ae" />
          </svg>
        </div>
        <div className="display-leaderboard-text">
          <div className="display-leaderboard-business">{businessName}</div>
          <div className="display-leaderboard-headline">{longHeadline || headline}</div>
        </div>
        <button className="display-leaderboard-cta">{cta}</button>
      </div>

      {/* 320×50 Mobile Banner */}
      <div className="preview-label" style={{ fontSize: 10, marginTop: 8 }}>320 × 50 — Mobile Banner</div>
      <div className="display-ad display-mobile-banner">
        <div className="display-mobile-image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="2" fill="#c8cdd4" />
            <path d="M3 18l5-7 4 5 3-4 5 6H3z" fill="#9aa3ae" />
            <circle cx="17" cy="6" r="3" fill="#9aa3ae" />
          </svg>
        </div>
        <div className="display-mobile-text">
          <span className="display-mobile-business">{businessName}</span>
          <span className="display-mobile-headline"> — {headline}</span>
        </div>
        <button className="display-mobile-cta">{cta}</button>
      </div>

      {/* Spec chips */}
      <div className="preview-specs" style={{ marginTop: 8 }}>
        {ad.dailyBudget && <span className="spec-chip">Budget: ${ad.dailyBudget}/day</span>}
        {ad.locationTargeting && <span className="spec-chip">📍 {ad.locationTargeting}</span>}
        <span className="spec-chip">{ad.targetingType}</span>
        <span className="spec-chip">{ad.shortHeadlines.filter(Boolean).length} headlines</span>
        <span className="spec-chip">{ad.descriptions.filter(Boolean).length} descriptions</span>
      </div>
    </div>
  );
}
