import { useState, useEffect } from 'react';
import type { GoogleDisplayAd, AdGoal, GoogleDisplayCTA } from '../types/ads';
import { CharCount } from './CharCount';
import { CopyAssistant } from './CopyAssistant';

interface Props {
  onSubmit: (ad: GoogleDisplayAd) => void;
  onChange?: (ad: GoogleDisplayAd) => void;
  initialValues?: GoogleDisplayAd;
}

const SHORT_HEADLINE_LIMIT = 30;
const LONG_HEADLINE_LIMIT = 90;
const DESCRIPTION_LIMIT = 90;

const defaultAd: GoogleDisplayAd = {
  platform: 'google',
  format: 'display',
  goal: 'traffic',
  campaignName: '',
  dailyBudget: '',
  businessName: '',
  shortHeadlines: ['', '', '', '', ''],
  longHeadline: '',
  descriptions: ['', ''],
  finalUrl: '',
  callToAction: 'Learn More',
  imageDescriptions: ['', '', ''],
  logoDescription: '',
  locationTargeting: '',
  targetingType: 'contextual',
};

export function GoogleDisplayForm({ onSubmit, onChange, initialValues }: Props) {
  const init = initialValues ?? defaultAd;
  const [ad, setAd] = useState<GoogleDisplayAd>(init);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onChange?.(ad);
  }, [ad]);

  function set<K extends keyof GoogleDisplayAd>(key: K, value: GoogleDisplayAd[K]) {
    setAd((prev) => ({ ...prev, [key]: value }));
  }

  function setShortHeadline(i: number, val: string) {
    const next = [...ad.shortHeadlines] as GoogleDisplayAd['shortHeadlines'];
    next[i] = val;
    set('shortHeadlines', next);
  }

  function setDescription(i: number, val: string) {
    const next = [...ad.descriptions] as GoogleDisplayAd['descriptions'];
    next[i] = val;
    set('descriptions', next);
  }

  function setImageDescription(i: number, val: string) {
    const next = [...ad.imageDescriptions];
    next[i] = val;
    set('imageDescriptions', next);
  }

  function handleCopyApply(field: string, slotIndex: number, value: string) {
    if (field === 'shortHeadline') setShortHeadline(slotIndex, value);
    if (field === 'longHeadline') set('longHeadline', value);
    if (field === 'description') setDescription(slotIndex, value);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!ad.campaignName) e.campaignName = 'Required';
    if (!ad.dailyBudget || isNaN(Number(ad.dailyBudget))) e.dailyBudget = 'Enter a valid number';
    if (!ad.businessName) e.businessName = 'Required';
    if (ad.businessName.length > 25) e.businessName = 'Max 25 characters';
    const filledHeadlines = ad.shortHeadlines.filter(Boolean);
    if (filledHeadlines.length < 3) e.shortHeadlines = 'At least 3 short headlines required';
    ad.shortHeadlines.forEach((h, i) => {
      if (h && h.length > SHORT_HEADLINE_LIMIT) e[`sh${i}`] = 'Too long';
    });
    if (!ad.longHeadline) e.longHeadline = 'Required';
    if (ad.longHeadline.length > LONG_HEADLINE_LIMIT) e.longHeadline = 'Too long';
    const filledDescs = ad.descriptions.filter(Boolean);
    if (filledDescs.length < 2) e.descriptions = 'At least 2 descriptions required';
    ad.descriptions.forEach((d, i) => {
      if (d && d.length > DESCRIPTION_LIMIT) e[`desc${i}`] = 'Too long';
    });
    if (!ad.finalUrl) e.finalUrl = 'Required';
    if (!ad.locationTargeting) e.locationTargeting = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(ad);
  }

  return (
    <form onSubmit={handleSubmit} className="ad-form">
      <div className="form-section">
        <h3>Campaign Basics</h3>

        <div className="field-group">
          <label>Campaign Goal</label>
          <select value={ad.goal} onChange={(e) => set('goal', e.target.value as AdGoal)}>
            <option value="traffic">Website Traffic</option>
            <option value="leads">Lead Conversion</option>
            <option value="awareness">Brand Awareness</option>
            <option value="calls">Phone Calls</option>
          </select>
        </div>

        <div className="field-group">
          <label>Campaign Name</label>
          <input
            type="text"
            value={ad.campaignName}
            onChange={(e) => set('campaignName', e.target.value)}
            placeholder="e.g. Spring Promo — Display"
          />
          {errors.campaignName && <span className="error">{errors.campaignName}</span>}
        </div>

        <div className="field-row">
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

          <div className="field-group">
            <label>Location Targeting</label>
            <input
              type="text"
              value={ad.locationTargeting}
              onChange={(e) => set('locationTargeting', e.target.value)}
              placeholder="e.g. Dallas, TX"
            />
            {errors.locationTargeting && <span className="error">{errors.locationTargeting}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Start Date (optional)</label>
            <input type="date" value={ad.startDate || ''} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div className="field-group">
            <label>End Date (optional)</label>
            <input type="date" value={ad.endDate || ''} onChange={(e) => set('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Ad Copy</h3>

        <CopyAssistant
          platform="google"
          format="display"
          goal={ad.goal}
          onApply={handleCopyApply}
        />

        <div className="field-group" style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Business Name</span>
            <CharCount current={ad.businessName.length} max={25} />
          </label>
          <input
            type="text"
            value={ad.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            placeholder="Your Company Name"
            maxLength={28}
          />
          {errors.businessName && <span className="error">{errors.businessName}</span>}
        </div>

        <div className="field-group">
          <label>Short Headlines (min 3, max 5 — 30 chars each)</label>
          {errors.shortHeadlines && <span className="error">{errors.shortHeadlines}</span>}
          {([0, 1, 2, 3, 4] as const).map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20, flexShrink: 0 }}>H{i + 1}</span>
              <input
                type="text"
                value={ad.shortHeadlines[i]}
                onChange={(e) => setShortHeadline(i, e.target.value)}
                placeholder={`Short headline ${i + 1}${i >= 3 ? ' (optional)' : ''}`}
                maxLength={33}
                style={{ flex: 1 }}
              />
              <CharCount current={ad.shortHeadlines[i].length} max={SHORT_HEADLINE_LIMIT} />
              {errors[`sh${i}`] && <span className="error">{errors[`sh${i}`]}</span>}
            </div>
          ))}
        </div>

        <div className="field-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Long Headline</span>
            <CharCount current={ad.longHeadline.length} max={LONG_HEADLINE_LIMIT} />
          </label>
          <input
            type="text"
            value={ad.longHeadline}
            onChange={(e) => set('longHeadline', e.target.value)}
            placeholder="One compelling headline that stands alone (90 chars)"
            maxLength={93}
          />
          {errors.longHeadline && <span className="error">{errors.longHeadline}</span>}
        </div>

        <div className="field-group">
          <label>Descriptions (min 2 — 90 chars each)</label>
          {errors.descriptions && <span className="error">{errors.descriptions}</span>}
          {([0, 1] as const).map((i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Description {i + 1}</span>
                <CharCount current={ad.descriptions[i].length} max={DESCRIPTION_LIMIT} />
              </label>
              <textarea
                value={ad.descriptions[i]}
                onChange={(e) => setDescription(i, e.target.value)}
                placeholder={`Description ${i + 1} — highlight a key benefit with a call to action`}
                rows={2}
                maxLength={93}
              />
              {errors[`desc${i}`] && <span className="error">{errors[`desc${i}`]}</span>}
            </div>
          ))}
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Call to Action</label>
            <select value={ad.callToAction} onChange={(e) => set('callToAction', e.target.value as GoogleDisplayCTA)}>
              <option value="Automated">Automated (Google chooses)</option>
              <option value="Book Now">Book Now</option>
              <option value="Contact Us">Contact Us</option>
              <option value="Download">Download</option>
              <option value="Get Quote">Get Quote</option>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Visit Site">Visit Site</option>
            </select>
          </div>

          <div className="field-group">
            <label>Final URL</label>
            <input
              type="url"
              value={ad.finalUrl}
              onChange={(e) => set('finalUrl', e.target.value)}
              placeholder="https://yoursite.com/page"
            />
            {errors.finalUrl && <span className="error">{errors.finalUrl}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Images &amp; Logo</h3>
        <small className="hint">Describe the images you plan to upload. Google requires landscape (1.91:1) and square (1:1) images.</small>

        <div className="field-group" style={{ marginTop: 10 }}>
          <label>Logo Description</label>
          <input
            type="text"
            value={ad.logoDescription}
            onChange={(e) => set('logoDescription', e.target.value)}
            placeholder="e.g. Company logo on white background (PNG, 1:1)"
          />
        </div>

        {[0, 1, 2].map((i) => (
          <div className="field-group" key={i}>
            <label>Image {i + 1} {i === 0 ? '(landscape, required)' : i === 1 ? '(square, required)' : '(optional)'}</label>
            <input
              type="text"
              value={ad.imageDescriptions[i] || ''}
              onChange={(e) => setImageDescription(i, e.target.value)}
              placeholder={
                i === 0
                  ? 'e.g. Team photo in branded van — 1200×628 px'
                  : i === 1
                  ? 'e.g. Product photo on clean background — 1200×1200 px'
                  : 'e.g. Before/after renovation photo'
              }
            />
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Targeting</h3>

        <div className="field-group">
          <label>Targeting Type</label>
          <select
            value={ad.targetingType}
            onChange={(e) => set('targetingType', e.target.value as GoogleDisplayAd['targetingType'])}
          >
            <option value="contextual">Contextual — pages related to your keywords/topics</option>
            <option value="audience">Audience segments — interests &amp; demographics</option>
            <option value="placement">Placements — specific websites &amp; apps</option>
            <option value="remarketing">Remarketing — past website visitors</option>
          </select>
        </div>

        {(ad.targetingType === 'contextual' || ad.targetingType === 'audience') && (
          <div className="field-group">
            <label>
              {ad.targetingType === 'contextual' ? 'Topics / Keywords' : 'Audience Description'}
            </label>
            <textarea
              value={ad.audienceDescription || ''}
              onChange={(e) => set('audienceDescription', e.target.value)}
              placeholder={
                ad.targetingType === 'contextual'
                  ? 'e.g. home improvement, plumbing, kitchen renovation'
                  : 'e.g. homeowners, age 30–55, interested in home improvement'
              }
              rows={2}
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Generate Instructions →
      </button>
    </form>
  );
}
