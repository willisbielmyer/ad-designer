import type { MetaAd } from '../types/ads';
import { CTA_LABELS } from '../platforms/meta';
import { MetaStoriesPreview } from './MetaStoriesPreview';

interface Props {
  ad: MetaAd;
}

export function MetaAdPreview({ ad }: Props) {
  if (ad.format === 'stories_reels') return <MetaStoriesPreview ad={ad} />;

  const primaryText = ad.primaryText || 'Your primary text will appear here. Write something that grabs attention in the first line.';
  const headline = ad.headline || 'Your Headline';
  const description = ad.description || '';
  const cta = CTA_LABELS[ad.ctaButton] || 'Learn More';
  const domain = ad.destinationUrl
    ? ad.destinationUrl.replace(/^https?:\/\//, '').split('/')[0].toUpperCase()
    : 'YOURSITE.COM';

  const truncated = primaryText.length > 125;
  const displayText = truncated ? primaryText.slice(0, 125) + '...' : primaryText;

  return (
    <div className="preview-wrapper">
      <div className="preview-label">Meta / Facebook Feed Preview</div>

      <div className="meta-card">
        {/* Post header */}
        <div className="meta-header">
          <div className="meta-avatar">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="20" fill="#e4e6eb"/>
              <text x="20" y="26" textAnchor="middle" fontSize="16" fill="#65676b">B</text>
            </svg>
          </div>
          <div className="meta-page-info">
            <div className="meta-page-name">{ad.campaignName || 'Your Business Name'}</div>
            <div className="meta-sponsored">Sponsored · <span className="meta-globe">🌐</span></div>
          </div>
          <div className="meta-more">···</div>
        </div>

        {/* Primary text */}
        <div className="meta-primary-text">
          {displayText}
          {truncated && <span className="meta-see-more"> See more</span>}
        </div>

        {/* Image placeholder */}
        <div className="meta-image-placeholder">
          <div className="meta-image-inner">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="4" fill="#bcc0c4"/>
              <path d="M14 34l8-10 6 7 4-5 8 8H14z" fill="#8a8d91"/>
              <circle cx="32" cy="18" r="5" fill="#8a8d91"/>
            </svg>
            <div className="meta-image-hint">1200 × 628 px</div>
            {ad.imageDescription && (
              <div className="meta-image-desc">"{ad.imageDescription}"</div>
            )}
          </div>
        </div>

        {/* Ad footer */}
        <div className="meta-footer">
          <div className="meta-footer-text">
            <div className="meta-footer-domain">{domain}</div>
            <div className="meta-footer-headline">{headline}</div>
            {description && <div className="meta-footer-desc">{description}</div>}
          </div>
          <button className="meta-cta-btn">{cta}</button>
        </div>

        {/* Reactions row */}
        <div className="meta-reactions">
          <div className="meta-reaction-icons">
            <span>👍</span><span>❤️</span><span>😮</span>
            <span className="meta-reaction-count">Like · Comment · Share</span>
          </div>
        </div>
      </div>

      {/* Instagram preview toggle */}
      {ad.placements.includes('instagram') && (
        <div className="preview-label" style={{ marginTop: 16 }}>Instagram Feed Preview</div>
      )}
      {ad.placements.includes('instagram') && (
        <div className="meta-card ig-card">
          <div className="meta-header">
            <div className="meta-avatar ig-avatar">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="16" fill="#e4e6eb"/>
                <text x="16" y="21" textAnchor="middle" fontSize="13" fill="#65676b">B</text>
              </svg>
            </div>
            <div className="meta-page-info">
              <div className="meta-page-name" style={{ fontSize: 13 }}>{ad.campaignName || 'yourbusiness'}</div>
              <div className="meta-sponsored" style={{ fontSize: 11 }}>Sponsored</div>
            </div>
            <div className="meta-more">···</div>
          </div>
          <div className="meta-image-placeholder ig-image">
            <div className="meta-image-inner">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="4" fill="#bcc0c4"/>
                <path d="M10 30l7-9 5 6 3-4 7 7H10z" fill="#8a8d91"/>
                <circle cx="28" cy="14" r="4" fill="#8a8d91"/>
              </svg>
              <div className="meta-image-hint">1080 × 1080 px (square)</div>
            </div>
          </div>
          <div className="ig-footer">
            <div className="ig-cta">
              <span className="ig-domain">{domain}</span>
              <button className="ig-cta-btn">{cta}</button>
            </div>
            <div className="ig-caption">{headline}</div>
          </div>
        </div>
      )}

      {/* Spec chips */}
      <div className="preview-specs">
        {ad.dailyBudget && <span className="spec-chip">Budget: ${ad.dailyBudget}/day</span>}
        {ad.locationTargeting && <span className="spec-chip">📍 {ad.locationTargeting}</span>}
        <span className="spec-chip">Ages {ad.ageMin}–{ad.ageMax}</span>
        {ad.placements.length > 0
          ? <span className="spec-chip">{ad.placements.length} placement{ad.placements.length !== 1 ? 's' : ''}</span>
          : <span className="spec-chip">Advantage+ placements</span>
        }
      </div>
    </div>
  );
}
