import type { LSAAd } from '../types/ads';

interface Props {
  ad: LSAAd;
}

export function LSAPreview({ ad }: Props) {
  const name = ad.businessName || 'Your Business Name';
  const category = ad.businessCategory || 'Home Services';
  const area = ad.serviceArea || 'Your City, ST';
  const phone = ad.phone || '(555) 555-5555';

  return (
    <div className="preview-wrapper">
      <div className="preview-label">Google Search Preview</div>

      {/* Simulated SERP context */}
      <div className="lsa-serp-context">
        <div className="lsa-serp-bar">
          <div className="lsa-google-logo">Google</div>
          <div className="lsa-search-bar">
            <span className="lsa-search-text">{category.toLowerCase()} near me</span>
            <span className="lsa-search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* LSA panel */}
      <div className="lsa-panel">
        <div className="lsa-panel-header">
          <span className="lsa-panel-title">Sponsored</span>
          <span className="lsa-panel-subtitle">Local Services results for</span>
        </div>

        {/* Single LSA card */}
        <div className="lsa-card lsa-card-active">
          <div className="lsa-card-top">
            <div className="lsa-business-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="lsa-card-info">
              <div className="lsa-business-name">{name}</div>
              <div className="lsa-rating">
                <span className="lsa-stars">★★★★★</span>
                <span className="lsa-review-count">5.0 (12)</span>
              </div>
              <div className="lsa-category">{category}</div>
            </div>
          </div>

          <div className="lsa-guarantee-badge">
            <span className="lsa-check">✓</span>
            <span className="lsa-guarantee-text">Google Guaranteed</span>
          </div>

          <div className="lsa-card-details">
            <div className="lsa-detail-row">
              <span className="lsa-detail-icon">📍</span>
              <span>{area}</span>
            </div>
            <div className="lsa-detail-row">
              <span className="lsa-detail-icon">🕐</span>
              <span>{ad.businessHours || 'Mon–Fri 8am–6pm'}</span>
            </div>
            {ad.services.length > 0 && (
              <div className="lsa-detail-row">
                <span className="lsa-detail-icon">🔧</span>
                <span>{ad.services.slice(0, 2).join(', ')}{ad.services.length > 2 ? ` +${ad.services.length - 2} more` : ''}</span>
              </div>
            )}
          </div>

          <div className="lsa-actions">
            <a href={`tel:${phone}`} className="lsa-btn lsa-btn-call">
              📞 {phone}
            </a>
            <button className="lsa-btn lsa-btn-message">✉ Message</button>
          </div>
        </div>

        {/* Ghost cards to show competition */}
        <div className="lsa-card lsa-card-ghost">
          <div className="lsa-card-top">
            <div className="lsa-business-avatar lsa-avatar-ghost">?</div>
            <div className="lsa-card-info">
              <div className="lsa-business-name lsa-ghost-bar" style={{ width: 120 }} />
              <div className="lsa-rating">
                <span className="lsa-stars lsa-stars-gray">★★★★☆</span>
                <span className="lsa-review-count">4.8 (34)</span>
              </div>
              <div className="lsa-ghost-bar" style={{ width: 80, marginTop: 4 }} />
            </div>
          </div>
          <div className="lsa-guarantee-badge">
            <span className="lsa-check">✓</span>
            <span className="lsa-guarantee-text">Google Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Pay-per-lead callout */}
      <div className="lsa-info-banner">
        <span className="lsa-info-icon">💡</span>
        <span>LSA charges per verified lead — you only pay when a customer contacts you through the ad.</span>
      </div>

      {/* Spec chips */}
      <div className="preview-specs">
        {ad.weeklyBudget && <span className="spec-chip">Budget: ${ad.weeklyBudget}/week</span>}
        {area && <span className="spec-chip">📍 {area}</span>}
        {ad.services.length > 0 && (
          <span className="spec-chip">{ad.services.length} service{ad.services.length !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}
