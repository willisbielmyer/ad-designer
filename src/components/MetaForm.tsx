import { useState, useEffect } from 'react';
import type { MetaAd, AdGoal, MetaCTA, MetaPlacement } from '../types/ads';
import { META_LIMITS } from '../platforms/meta';
import { CharCount } from './CharCount';
import { CopyAssistant } from './CopyAssistant';

interface Props {
  onSubmit: (ad: MetaAd) => void;
  onChange?: (ad: MetaAd) => void;
  initialValues?: MetaAd;
}

const defaultAd: MetaAd = {
  platform: 'meta',
  format: 'feed',
  goal: 'traffic',
  campaignName: '',
  dailyBudget: '',
  primaryText: '',
  headline: '',
  description: '',
  ctaButton: 'LEARN_MORE',
  destinationUrl: '',
  imageDescription: '',
  ageMin: 18,
  ageMax: 65,
  genderTargeting: 'all',
  locationTargeting: '',
  interestTargeting: '',
  placements: [],
};

const FEED_PLACEMENTS: { value: MetaPlacement; label: string }[] = [
  { value: 'feed', label: 'Facebook Feed' },
  { value: 'instagram', label: 'Instagram Feed' },
  { value: 'marketplace', label: 'Facebook Marketplace' },
];

const STORIES_PLACEMENTS: { value: MetaPlacement; label: string }[] = [
  { value: 'stories', label: 'Stories (FB + IG)' },
  { value: 'reels', label: 'Instagram Reels' },
];

export function MetaForm({ onSubmit, onChange, initialValues }: Props) {
  const init = initialValues ?? defaultAd;
  const [ad, setAd] = useState<MetaAd>(init);
  const [leadQsRaw, setLeadQsRaw] = useState((init.leadFormQuestions ?? []).join('\n'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onChange?.({
      ...ad,
      leadFormQuestions: leadQsRaw.split('\n').map((q) => q.trim()).filter(Boolean),
    });
  }, [ad, leadQsRaw]);

  function set<K extends keyof MetaAd>(key: K, value: MetaAd[K]) {
    setAd((prev) => ({ ...prev, [key]: value }));
  }

  function setFormat(format: MetaAd['format']) {
    setAd((prev) => ({ ...prev, format, placements: [] }));
  }

  function handleCopyApply(field: string, _slotIndex: number, value: string) {
    if (field === 'primaryText' || field === 'overlayText') set('primaryText', value);
    if (field === 'headline') set('headline', value);
  }

  function togglePlacement(p: MetaPlacement) {
    const current = ad.placements;
    if (current.includes(p)) {
      set('placements', current.filter((x) => x !== p));
    } else {
      set('placements', [...current, p]);
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!ad.campaignName) e.campaignName = 'Required';
    if (!ad.dailyBudget || isNaN(Number(ad.dailyBudget))) e.dailyBudget = 'Enter a valid number';
    if (!ad.primaryText) e.primaryText = 'Required';
    if (ad.primaryText.length > META_LIMITS.primaryText) e.primaryText = 'Too long';
    if (!ad.headline) e.headline = 'Required';
    if (ad.headline.length > META_LIMITS.headline) e.headline = 'Too long';
    if (!ad.destinationUrl) e.destinationUrl = 'Required';
    if (!ad.locationTargeting) e.locationTargeting = 'Required';
    if (ad.goal === 'leads' && !ad.privacyPolicyUrl) e.privacyPolicyUrl = 'Required for lead ads';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...ad,
      leadFormQuestions: leadQsRaw.split('\n').map((q) => q.trim()).filter(Boolean),
    });
  }

  const isStories = ad.format === 'stories_reels';
  const placements = isStories ? STORIES_PLACEMENTS : FEED_PLACEMENTS;
  const imageHint = isStories ? '1080 × 1920 px (9:16 vertical)' : '1200 × 628 px (16:9 horizontal)';

  return (
    <form onSubmit={handleSubmit} className="ad-form">
      <div className="form-section">
        <h3>Ad Format</h3>
        <div className="format-toggle">
          <button
            type="button"
            className={`format-btn ${!isStories ? 'format-btn-active' : ''}`}
            onClick={() => setFormat('feed')}
          >
            <span className="format-btn-icon">▬</span>
            Feed
            <small>Facebook · Instagram</small>
          </button>
          <button
            type="button"
            className={`format-btn ${isStories ? 'format-btn-active' : ''}`}
            onClick={() => setFormat('stories_reels')}
          >
            <span className="format-btn-icon">▮</span>
            Stories / Reels
            <small>Vertical full-screen</small>
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>Campaign Basics</h3>

        <div className="field-group">
          <label>Campaign Goal</label>
          <select value={ad.goal} onChange={(e) => set('goal', e.target.value as AdGoal)}>
            <option value="traffic">Website Traffic</option>
            <option value="leads">Lead Generation</option>
            <option value="awareness">Brand Awareness</option>
            <option value="calls">Calls</option>
          </select>
        </div>

        <div className="field-group">
          <label>Campaign Name</label>
          <input
            type="text"
            value={ad.campaignName}
            onChange={(e) => set('campaignName', e.target.value)}
            placeholder="e.g. Summer Sale — Meta"
          />
          {errors.campaignName && <span className="error">{errors.campaignName}</span>}
        </div>

        <div className="field-group">
          <label>Daily Budget ($)</label>
          <input
            type="number"
            value={ad.dailyBudget}
            onChange={(e) => set('dailyBudget', e.target.value)}
            placeholder="20"
            min="1"
          />
          {errors.dailyBudget && <span className="error">{errors.dailyBudget}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Ad Copy</h3>

        <CopyAssistant
          platform="meta"
          format={ad.format}
          goal={ad.goal}
          onApply={handleCopyApply}
        />

        <div className="field-group" style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{isStories ? 'Text Overlay (optional)' : 'Primary Text (shows above image)'}</span>
            <CharCount current={ad.primaryText.length} max={META_LIMITS.primaryText} />
          </label>
          <textarea
            value={ad.primaryText}
            onChange={(e) => set('primaryText', e.target.value)}
            placeholder={
              isStories
                ? 'Short overlay text — keep it punchy, the visual does the work.'
                : 'Hook your audience in the first line — describe the offer or problem you solve.'
            }
            rows={3}
          />
          {errors.primaryText && <span className="error">{errors.primaryText}</span>}
        </div>


        {!isStories && (
          <div className="field-row">
            <div className="field-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Headline</span>
                <CharCount current={ad.headline.length} max={META_LIMITS.headline} />
              </label>
              <input
                type="text"
                value={ad.headline}
                onChange={(e) => set('headline', e.target.value)}
                placeholder="Short, punchy headline"
                maxLength={30}
              />
              {errors.headline && <span className="error">{errors.headline}</span>}
            </div>

            <div className="field-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Description (optional)</span>
                <CharCount current={ad.description.length} max={META_LIMITS.description} />
              </label>
              <input
                type="text"
                value={ad.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Supporting detail"
                maxLength={30}
              />
            </div>
          </div>
        )}

        {isStories && (
          <div className="field-group">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Headline (shown on CTA bar)</span>
              <CharCount current={ad.headline.length} max={META_LIMITS.headline} />
            </label>
            <input
              type="text"
              value={ad.headline}
              onChange={(e) => set('headline', e.target.value)}
              placeholder="Short CTA line"
              maxLength={30}
            />
            {errors.headline && <span className="error">{errors.headline}</span>}
          </div>
        )}

        <div className="field-row">
          <div className="field-group">
            <label>Call to Action Button</label>
            <select
              value={ad.ctaButton}
              onChange={(e) => set('ctaButton', e.target.value as MetaCTA)}
            >
              <option value="LEARN_MORE">Learn More</option>
              <option value="SIGN_UP">Sign Up</option>
              <option value="CONTACT_US">Contact Us</option>
              <option value="BOOK_NOW">Book Now</option>
              <option value="GET_QUOTE">Get Quote</option>
              <option value="CALL_NOW">Call Now</option>
              <option value="SHOP_NOW">Shop Now</option>
            </select>
          </div>

          <div className="field-group">
            <label>Destination URL</label>
            <input
              type="url"
              value={ad.destinationUrl}
              onChange={(e) => set('destinationUrl', e.target.value)}
              placeholder="https://yoursite.com"
            />
            {errors.destinationUrl && <span className="error">{errors.destinationUrl}</span>}
          </div>
        </div>

        <div className="field-group">
          <label>Image / Video Description</label>
          <input
            type="text"
            value={ad.imageDescription}
            onChange={(e) => set('imageDescription', e.target.value)}
            placeholder="Describe the creative you plan to use"
          />
          <small className="hint">Required size: {imageHint}</small>
        </div>
      </div>

      <div className="form-section">
        <h3>Audience Targeting</h3>

        <div className="field-group">
          <label>Location</label>
          <input
            type="text"
            value={ad.locationTargeting}
            onChange={(e) => set('locationTargeting', e.target.value)}
            placeholder="e.g. Miami, FL — 25 mile radius"
          />
          {errors.locationTargeting && <span className="error">{errors.locationTargeting}</span>}
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Min Age</label>
            <input
              type="number"
              value={ad.ageMin}
              onChange={(e) => set('ageMin', Number(e.target.value))}
              min={18}
              max={65}
            />
          </div>
          <div className="field-group">
            <label>Max Age</label>
            <input
              type="number"
              value={ad.ageMax}
              onChange={(e) => set('ageMax', Number(e.target.value))}
              min={18}
              max={65}
            />
          </div>
          <div className="field-group">
            <label>Gender</label>
            <select
              value={ad.genderTargeting}
              onChange={(e) => set('genderTargeting', e.target.value as MetaAd['genderTargeting'])}
            >
              <option value="all">All Genders</option>
              <option value="male">Men Only</option>
              <option value="female">Women Only</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label>Interest Targeting (optional)</label>
          <input
            type="text"
            value={ad.interestTargeting}
            onChange={(e) => set('interestTargeting', e.target.value)}
            placeholder="e.g. Home improvement, Homeowners, DIY"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Placements</h3>
        <small className="hint">
          Leave all unchecked to use Advantage+ (Meta auto-optimizes)
        </small>
        <div className="checkbox-group">
          {placements.map((p) => (
            <label key={p.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={ad.placements.includes(p.value)}
                onChange={() => togglePlacement(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      {ad.goal === 'leads' && (
        <div className="form-section">
          <h3>Lead Form</h3>

          <div className="field-group">
            <label>Lead Form Questions (one per line)</label>
            <textarea
              value={leadQsRaw}
              onChange={(e) => setLeadQsRaw(e.target.value)}
              placeholder={'What service are you interested in?\nBest time to call?'}
              rows={4}
            />
            <small className="hint">Name, email, and phone are auto-added by Meta</small>
          </div>

          <div className="field-group">
            <label>Privacy Policy URL</label>
            <input
              type="url"
              value={ad.privacyPolicyUrl || ''}
              onChange={(e) => set('privacyPolicyUrl', e.target.value)}
              placeholder="https://yoursite.com/privacy"
            />
            {errors.privacyPolicyUrl && (
              <span className="error">{errors.privacyPolicyUrl}</span>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary">
        Generate Instructions →
      </button>
    </form>
  );
}
