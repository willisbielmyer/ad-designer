import type { GoogleAd } from '../types/ads';

interface Props {
  ad: GoogleAd;
}

const PLACEHOLDER = {
  headline: 'Your Headline Here',
  description: 'Your ad description will appear here. Make it compelling and relevant to your keywords.',
  url: 'yoursite.com',
};

export function GoogleAdPreview({ ad }: Props) {
  const h1 = ad.headlines[0] || PLACEHOLDER.headline;
  const h2 = ad.headlines[1];
  const h3 = ad.headlines[2];
  const d1 = ad.descriptions[0] || PLACEHOLDER.description;
  const d2 = ad.descriptions[1];
  const displayUrl = ad.finalUrl
    ? ad.finalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : PLACEHOLDER.url;

  const headlineParts = [h1, h2, h3].filter(Boolean).join(' | ');
  const descText = [d1, d2].filter(Boolean).join(' ');

  return (
    <div className="preview-wrapper">
      <div className="preview-label">Google Search Preview</div>

      {/* SERP container */}
      <div className="google-serp">
        {/* Sponsored label */}
        <div className="google-sponsored">Sponsored</div>

        {/* URL row */}
        <div className="google-url-row">
          <div className="google-favicon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect width="18" height="18" rx="9" fill="#e8eaed"/>
              <text x="9" y="13" textAnchor="middle" fontSize="10" fill="#5f6368">W</text>
            </svg>
          </div>
          <div className="google-url-text">
            <span className="google-domain">{displayUrl.split('/')[0]}</span>
            {displayUrl.includes('/') && (
              <span className="google-path"> › {displayUrl.split('/').slice(1).join(' › ')}</span>
            )}
            <div className="google-domain-label">{displayUrl}</div>
          </div>
        </div>

        {/* Headline */}
        <div className="google-headline">{headlineParts}</div>

        {/* Description */}
        <div className="google-description">{descText}</div>

        {/* Call extension if present */}
        {ad.callExtension && (
          <div className="google-extension">
            <span className="extension-icon">📞</span> {ad.callExtension}
          </div>
        )}
      </div>

      {/* Spec chips */}
      <div className="preview-specs">
        {ad.goal && <span className="spec-chip">Goal: {ad.goal}</span>}
        {ad.dailyBudget && <span className="spec-chip">Budget: ${ad.dailyBudget}/day</span>}
        {ad.locationTargeting && <span className="spec-chip">📍 {ad.locationTargeting}</span>}
        {ad.keywords.length > 0 && (
          <span className="spec-chip">{ad.keywords.length} keyword{ad.keywords.length !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}
