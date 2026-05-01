import { useState } from 'react';
import type { Platform, AnyAd, SavedCampaign } from '../types/ads';
import type { GoogleAd, GoogleDisplayAd, MetaAd, TikTokAd, LSAAd } from '../types/ads';
import { GoogleForm } from '../components/GoogleForm';
import { GoogleDisplayForm } from '../components/GoogleDisplayForm';
import { MetaForm } from '../components/MetaForm';
import { TikTokForm } from '../components/TikTokForm';
import { LSAForm } from '../components/LSAForm';
import { StepList } from '../components/StepList';
import { GoogleAdPreview } from '../components/GoogleAdPreview';
import { GoogleDisplayPreview } from '../components/GoogleDisplayPreview';
import { MetaAdPreview } from '../components/MetaAdPreview';
import { TikTokPreview } from '../components/TikTokPreview';
import { LSAPreview } from '../components/LSAPreview';
import { CampaignManager } from '../components/CampaignManager';
import { ABVariations } from '../components/ABVariations';
import { generateGoogleSteps } from '../platforms/google';
import { generateGoogleDisplaySteps } from '../platforms/google-display';
import { generateMetaSteps } from '../platforms/meta';
import { generateTikTokSteps } from '../platforms/tiktok';
import { generateLSASteps } from '../platforms/lsa';

const PLATFORMS: { value: Platform; label: string; color: string; icon: string }[] = [
  { value: 'google', label: 'Google Ads', color: '#4285F4', icon: 'G' },
  { value: 'meta', label: 'Meta Ads', color: '#0866FF', icon: 'f' },
  { value: 'tiktok', label: 'TikTok Ads', color: '#fe2c55', icon: '♪' },
  { value: 'lsa', label: 'Local Services', color: '#34A853', icon: '✓' },
];

type GoogleFormat = 'search' | 'display';
type RightTab = 'preview' | 'instructions' | 'variations';

export function Builder() {
  const [platform, setPlatform] = useState<Platform>('google');
  const [googleFormat, setGoogleFormat] = useState<GoogleFormat>('search');
  const [draft, setDraft] = useState<AnyAd | null>(null);
  const [submitted, setSubmitted] = useState<AnyAd | null>(null);
  const [activeTab, setActiveTab] = useState<RightTab>('preview');
  const [formKey, setFormKey] = useState(0);
  const [loadedValues, setLoadedValues] = useState<AnyAd | null>(null);

  function handleChange(ad: AnyAd) {
    setDraft(ad);
  }

  function handleSubmit(ad: AnyAd) {
    setSubmitted(ad);
    setActiveTab('instructions');
  }

  function handleLoad(campaign: SavedCampaign) {
    setPlatform(campaign.platform);
    setLoadedValues(campaign.ad);
    setDraft(campaign.ad);
    setSubmitted(null);
    setActiveTab('preview');
    setFormKey((k) => k + 1);
    if (campaign.platform === 'google') {
      const ad = campaign.ad as GoogleAd | GoogleDisplayAd;
      setGoogleFormat(ad.format === 'display' ? 'display' : 'search');
    }
  }

  function loadVariation(fields: Record<string, any>) {
    if (!draft) return;
    const merged = { ...draft, ...fields } as AnyAd;
    setLoadedValues(merged);
    setDraft(merged);
    setSubmitted(null);
    setActiveTab('preview');
    setFormKey((k) => k + 1);
  }

  function switchPlatform(p: Platform) {
    setPlatform(p);
    setDraft(null);
    setSubmitted(null);
    setLoadedValues(null);
    setActiveTab('preview');
    setFormKey((k) => k + 1);
    if (p === 'google') setGoogleFormat('search');
  }

  function switchGoogleFormat(f: GoogleFormat) {
    setGoogleFormat(f);
    setDraft(null);
    setSubmitted(null);
    setLoadedValues(null);
    setActiveTab('preview');
    setFormKey((k) => k + 1);
  }

  function getSteps() {
    if (!submitted) return [];
    if (submitted.platform === 'google') {
      const gAd = submitted as GoogleAd | GoogleDisplayAd;
      if (gAd.format === 'display') return generateGoogleDisplaySteps(gAd as GoogleDisplayAd);
      return generateGoogleSteps(submitted as GoogleAd);
    }
    if (submitted.platform === 'meta') return generateMetaSteps(submitted as MetaAd);
    if (submitted.platform === 'tiktok') return generateTikTokSteps(submitted as TikTokAd);
    return generateLSASteps(submitted as LSAAd);
  }

  const activePlatform = PLATFORMS.find((p) => p.value === platform)!;

  const googleDisplayAd = draft?.platform === 'google' && (draft as GoogleAd | GoogleDisplayAd).format === 'display'
    ? draft as GoogleDisplayAd : null;
  const googleSearchAd = draft?.platform === 'google' && (draft as GoogleAd | GoogleDisplayAd).format === 'search'
    ? draft as GoogleAd : null;

  return (
    <div className="builder-layout">
      {/* Left: form */}
      <div className="builder-left">
        <h2>Ad Designer</h2>
        <p className="subtitle">Fill in your ad details — the preview updates live as you type.</p>

        <div className="platform-tabs">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              className={`platform-tab ${platform === p.value ? 'active' : ''}`}
              style={platform === p.value ? { borderColor: p.color, color: p.color, background: `${p.color}10` } : {}}
              onClick={() => switchPlatform(p.value)}
            >
              <span className="platform-icon" style={platform === p.value ? { background: p.color } : {}}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Google sub-format toggle */}
        {platform === 'google' && (
          <div className="format-toggle" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={`format-btn ${googleFormat === 'search' ? 'format-btn-active' : ''}`}
              style={googleFormat === 'search' ? { borderColor: '#4285F4', color: '#4285F4', background: '#e8f0fe' } : {}}
              onClick={() => switchGoogleFormat('search')}
            >
              <span className="format-btn-icon">🔍</span>
              Search
              <small>Text ads on Google</small>
            </button>
            <button
              type="button"
              className={`format-btn ${googleFormat === 'display' ? 'format-btn-active' : ''}`}
              style={googleFormat === 'display' ? { borderColor: '#4285F4', color: '#4285F4', background: '#e8f0fe' } : {}}
              onClick={() => switchGoogleFormat('display')}
            >
              <span className="format-btn-icon">🖼</span>
              Display
              <small>Banner ads across the web</small>
            </button>
          </div>
        )}

        <CampaignManager currentAd={draft} currentPlatform={platform} onLoad={handleLoad} />

        {platform === 'google' && googleFormat === 'search' && (
          <GoogleForm key={formKey} onSubmit={handleSubmit} onChange={handleChange}
            initialValues={loadedValues?.platform === 'google' && (loadedValues as GoogleAd).format === 'search'
              ? (loadedValues as GoogleAd) : undefined} />
        )}
        {platform === 'google' && googleFormat === 'display' && (
          <GoogleDisplayForm key={formKey} onSubmit={handleSubmit} onChange={handleChange}
            initialValues={loadedValues?.platform === 'google' && (loadedValues as GoogleDisplayAd).format === 'display'
              ? (loadedValues as GoogleDisplayAd) : undefined} />
        )}
        {platform === 'meta' && (
          <MetaForm key={formKey} onSubmit={handleSubmit} onChange={handleChange}
            initialValues={loadedValues?.platform === 'meta' ? (loadedValues as MetaAd) : undefined} />
        )}
        {platform === 'tiktok' && (
          <TikTokForm key={formKey} onSubmit={handleSubmit} onChange={handleChange}
            initialValues={loadedValues?.platform === 'tiktok' ? (loadedValues as TikTokAd) : undefined} />
        )}
        {platform === 'lsa' && (
          <LSAForm key={formKey} onSubmit={handleSubmit} onChange={handleChange}
            initialValues={loadedValues?.platform === 'lsa' ? (loadedValues as LSAAd) : undefined} />
        )}
      </div>

      {/* Right: preview + instructions + variations */}
      <div className="builder-right">
        <div className="right-tabs">
          <button
            className={`right-tab ${activeTab === 'preview' ? 'right-tab-active' : ''}`}
            style={activeTab === 'preview' ? { borderBottomColor: activePlatform.color, color: activePlatform.color } : {}}
            onClick={() => setActiveTab('preview')}
          >Preview</button>
          <button
            className={`right-tab ${activeTab === 'instructions' ? 'right-tab-active' : ''}`}
            style={activeTab === 'instructions' ? { borderBottomColor: activePlatform.color, color: activePlatform.color } : {}}
            onClick={() => setActiveTab('instructions')}
            disabled={!submitted}
          >
            Instructions
            {submitted && <span className="tab-badge" style={{ background: activePlatform.color }}>✓</span>}
          </button>
          <button
            className={`right-tab ${activeTab === 'variations' ? 'right-tab-active' : ''}`}
            style={activeTab === 'variations' ? { borderBottomColor: '#7c3aed', color: '#7c3aed' } : {}}
            onClick={() => setActiveTab('variations')}
          >
            A/B Variations
          </button>
          {submitted && activeTab === 'instructions' && (
            <button className="btn-secondary print-btn" onClick={() => window.print()}>Print / PDF</button>
          )}
        </div>

        {activeTab === 'preview' && (
          <div className="right-panel-content">
            {googleSearchAd && <GoogleAdPreview ad={googleSearchAd} />}
            {googleDisplayAd && <GoogleDisplayPreview ad={googleDisplayAd} />}
            {draft?.platform === 'meta' && <MetaAdPreview ad={draft as MetaAd} />}
            {draft?.platform === 'tiktok' && <TikTokPreview ad={draft as TikTokAd} />}
            {draft?.platform === 'lsa' && <LSAPreview ad={draft as LSAAd} />}
            {!draft && (
              <div className="preview-empty">
                <div className="preview-empty-icon">👆</div>
                <p>Start filling in the form and your ad preview will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructions' && submitted && (
          <div className="right-panel-content">
            <div className="instructions-header">
              <div className="platform-badge" style={{ background: activePlatform.color }}>{activePlatform.icon}</div>
              <div>
                <h2>Posting Instructions</h2>
                <p className="subtitle">
                  {activePlatform.label}
                  {submitted.platform === 'google' && (submitted as GoogleAd | GoogleDisplayAd).format === 'display' ? ' Display'
                    : submitted.platform === 'google' ? ' Search' : ''}
                  {' '}— follow these steps in order
                </p>
              </div>
            </div>
            <StepList steps={getSteps()} platformColor={activePlatform.color} />
          </div>
        )}

        {activeTab === 'instructions' && !submitted && (
          <div className="preview-empty">
            <div className="preview-empty-icon">📋</div>
            <p>Fill in the form and click "Generate Instructions" to see the step-by-step posting guide.</p>
          </div>
        )}

        {activeTab === 'variations' && (
          <div className="right-panel-content">
            <ABVariations draft={draft} onLoadVariation={loadVariation} />
          </div>
        )}
      </div>
    </div>
  );
}
