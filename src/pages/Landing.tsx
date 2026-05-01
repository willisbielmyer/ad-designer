import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="lp">
      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-ai-badge">✨ AI-Powered Copy &amp; Images</div>
          <h1 className="lp-headline">
            Design Professional Ads<br />
            <span className="lp-headline-accent">in Minutes</span>
          </h1>
          <p className="lp-subline">
            Build Google Search, Display, Meta Feed, Stories, and Local Service ads —
            with live previews, AI-generated copy and images, and step-by-step posting instructions.
          </p>
          <Link to="/builder" className="lp-cta-btn">
            Start Designing Free →
          </Link>
          <div className="lp-platform-pills">
            <span className="lp-pill lp-pill-google">G Google Search</span>
            <span className="lp-pill lp-pill-google">🖼 Google Display</span>
            <span className="lp-pill lp-pill-meta">f Meta Feed</span>
            <span className="lp-pill lp-pill-meta">▮ Stories &amp; Reels</span>
            <span className="lp-pill lp-pill-lsa">✓ Local Services</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">Everything you need to run great ads</h2>
          <div className="lp-feature-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon">👁</div>
              <h3>Live Ad Preview</h3>
              <p>See exactly how your ad looks as you type — pixel-perfect mockups for every format and placement.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">✨</div>
              <h3>AI Copy Assistant</h3>
              <p>Describe your business and get platform-optimized headlines, descriptions, and primary text in seconds.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🖼</div>
              <h3>AI Image Generator</h3>
              <p>Generate professional ad creatives with DALL-E 3. Download and upload directly to your ad platform.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📋</div>
              <h3>Posting Instructions</h3>
              <p>Get a complete step-by-step guide to posting your ad — every field, every setting, in order.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">💾</div>
              <h3>Save Campaigns</h3>
              <p>Save your ad drafts and reload them any time. Never start from scratch again.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🖨</div>
              <h3>Print to PDF</h3>
              <p>Export your posting instructions as a PDF to share with your team or keep for your records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="lp-platforms-section">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">5 ad formats, one tool</h2>
          <div className="lp-platform-cards">
            <div className="lp-platform-card">
              <div className="lp-platform-badge" style={{ background: '#4285F4' }}>G</div>
              <h3>Google Search</h3>
              <p>Text ads that appear when people search. Headlines, descriptions, keywords, and bid strategy — all guided.</p>
            </div>
            <div className="lp-platform-card">
              <div className="lp-platform-badge" style={{ background: '#4285F4' }}>🖼</div>
              <h3>Google Display</h3>
              <p>Responsive banner ads across 2M+ websites. Upload images, headlines, and let Google optimize the layout.</p>
            </div>
            <div className="lp-platform-card">
              <div className="lp-platform-badge" style={{ background: '#0866FF' }}>f</div>
              <h3>Meta Feed</h3>
              <p>Facebook and Instagram feed ads. Primary text, headline, CTA, audience targeting — with a live mockup.</p>
            </div>
            <div className="lp-platform-card">
              <div className="lp-platform-badge" style={{ background: '#0866FF' }}>▮</div>
              <h3>Stories &amp; Reels</h3>
              <p>Full-screen vertical video ads. See your copy on a phone frame preview before you publish.</p>
            </div>
            <div className="lp-platform-card">
              <div className="lp-platform-badge" style={{ background: '#34A853' }}>✓</div>
              <h3>Local Services</h3>
              <p>Google Guaranteed pay-per-lead ads for local businesses. Includes category guidance and verification checklist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-section-inner lp-cta-inner">
          <h2>Ready to build your first ad?</h2>
          <p>No account required. Start designing in seconds.</p>
          <Link to="/builder" className="lp-cta-btn lp-cta-btn-large">
            Open Ad Designer →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-section-inner lp-footer-inner">
          <div className="lp-footer-logo">
            <span>📢</span>
            <span>Ad Designer</span>
          </div>
          <p className="lp-footer-note">AI copy powered by Claude · Images by DALL-E 3</p>
        </div>
      </footer>
    </div>
  );
}
