import type { TikTokAd } from '../types/ads';

interface Props {
  ad: TikTokAd;
}

export function TikTokPreview({ ad }: Props) {
  const username = ad.campaignName ? `@${ad.campaignName.toLowerCase().replace(/\s+/g, '')}` : '@yourbusiness';
  const caption = ad.caption || 'Your caption will appear here — make it punchy and scroll-stopping.';
  const hashtags = ad.hashtags || '#fyp #ad';
  const cta = ad.ctaButton || 'Learn More';

  return (
    <div className="preview-wrapper">
      <div className="preview-label">TikTok In-Feed Ad Preview</div>

      <div className="phone-frame">
        <div className="phone-notch" />

        <div className="tiktok-screen">
          {/* Background / video area */}
          <div className="tiktok-bg">
            {ad.generatedImageUrl ? (
              <img
                src={ad.generatedImageUrl}
                alt="Ad creative"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect width="56" height="56" rx="4" fill="#2a2a3a" />
                  <path d="M10 44l12-16 9 11 7-9 12 14H10z" fill="#3a3a4a" />
                  <circle cx="38" cy="18" r="7" fill="#3a3a4a" />
                </svg>
                <div className="tiktok-bg-spec">1080 × 1920 · {ad.videoDuration}</div>
                {ad.videoDescription && (
                  <div className="tiktok-bg-hint">"{ad.videoDescription.slice(0, 60)}{ad.videoDescription.length > 60 ? '…' : ''}"</div>
                )}
              </>
            )}
          </div>

          {/* Top bar */}
          <div className="tiktok-top">
            <span className="tiktok-following">Following</span>
            <span className="tiktok-foryou tiktok-active">For You</span>
          </div>

          {/* Sponsored label */}
          <div className="tiktok-sponsored">Sponsored</div>

          {/* Right sidebar */}
          <div className="tiktok-sidebar">
            <div className="tiktok-avatar">{username.charAt(1).toUpperCase()}</div>
            <div className="tiktok-action">
              <div className="tiktok-action-icon">♥</div>
              <span>24K</span>
            </div>
            <div className="tiktok-action">
              <div className="tiktok-action-icon">💬</div>
              <span>318</span>
            </div>
            <div className="tiktok-action">
              <div className="tiktok-action-icon">↗</div>
              <span>Share</span>
            </div>
            <div className="tiktok-disc">♪</div>
          </div>

          {/* Bottom info */}
          <div className="tiktok-bottom">
            <div className="tiktok-username">{username}</div>
            <div className="tiktok-caption">{caption}</div>
            <div className="tiktok-hashtags">{hashtags}</div>
            <button className="tiktok-cta-btn">{cta} →</button>
          </div>

          {/* Progress bar */}
          <div className="tiktok-progress">
            <div className="tiktok-progress-fill" />
          </div>
        </div>

        <div className="phone-home-bar" />
      </div>

      {/* Spec chips */}
      <div className="preview-specs">
        {ad.dailyBudget && <span className="spec-chip">Budget: ${ad.dailyBudget}/day</span>}
        {ad.locationTargeting && <span className="spec-chip">📍 {ad.locationTargeting}</span>}
        <span className="spec-chip">Ages {ad.ageMin}–{ad.ageMax}</span>
        <span className="spec-chip">9:16 · {ad.videoDuration}</span>
      </div>
    </div>
  );
}
