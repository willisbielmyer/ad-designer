import { useState, useEffect } from 'react';
import type { GoogleAd, AdGoal } from '../types/ads';
import { GOOGLE_LIMITS } from '../platforms/google';
import { CharCount } from './CharCount';
import { CopyAssistant } from './CopyAssistant';

interface Props {
  onSubmit: (ad: GoogleAd) => void;
  onChange?: (ad: GoogleAd) => void;
  initialValues?: GoogleAd;
}

const defaultAd: GoogleAd = {
  platform: 'google',
  format: 'search',
  goal: 'traffic',
  campaignName: '',
  dailyBudget: '',
  headlines: ['', '', ''],
  descriptions: ['', ''],
  finalUrl: '',
  keywords: [],
  keywordMatchType: 'broad',
  bidStrategy: 'maximize_clicks',
  locationTargeting: '',
};

const DRAFT_KEY = 'ad-designer-google-search-draft';

export function GoogleForm({ onSubmit, onChange, initialValues }: Props) {
  const savedDraft = !initialValues ? (() => {
    try { const s = sessionStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  })() : null;

  const init = initialValues ?? savedDraft ?? defaultAd;
  const [ad, setAd] = useState<GoogleAd>(init);
  const [keywordsRaw, setKeywordsRaw] = useState(init.keywords.join('\n'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const full = { ...ad, keywords: keywordsRaw.split('\n').map((k) => k.trim()).filter(Boolean) };
    onChange?.(full);
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(full)); } catch {}
  }, [ad, keywordsRaw]);

  function set<K extends keyof GoogleAd>(key: K, value: GoogleAd[K]) {
    setAd((prev) => ({ ...prev, [key]: value }));
  }

  function setHeadline(i: number, val: string) {
    const next = [...ad.headlines] as [string, string, string];
    next[i] = val;
    set('headlines', next);
  }

  function setDescription(i: number, val: string) {
    const next = [...ad.descriptions] as [string, string];
    next[i] = val;
    set('descriptions', next);
  }

  function handleCopyApply(field: string, slotIndex: number, value: string) {
    if (field === 'headline') setHeadline(slotIndex, value);
    if (field === 'description') setDescription(slotIndex, value);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!ad.campaignName) e.campaignName = 'Required';
    if (!ad.dailyBudget || isNaN(Number(ad.dailyBudget))) e.dailyBudget = 'Enter a valid number';
    ad.headlines.forEach((h, i) => {
      if (!h) e[`headline${i}`] = 'Required';
      if (h.length > GOOGLE_LIMITS.headline) e[`headline${i}`] = 'Too long';
    });
    ad.descriptions.forEach((d, i) => {
      if (!d) e[`desc${i}`] = 'Required';
      if (d.length > GOOGLE_LIMITS.description) e[`desc${i}`] = 'Too long';
    });
    if (!ad.finalUrl) e.finalUrl = 'Required';
    if (!keywordsRaw.trim()) e.keywords = 'Add at least one keyword';
    if (!ad.locationTargeting) e.locationTargeting = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...ad,
      keywords: keywordsRaw
        .split('\n')
        .map((k) => k.trim())
        .filter(Boolean),
    });
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
            placeholder="e.g. Spring Promo — Search"
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
              placeholder="25"
              min="1"
            />
            {errors.dailyBudget && <span className="error">{errors.dailyBudget}</span>}
          </div>

          <div className="field-group">
            <label>Bid Strategy</label>
            <select
              value={ad.bidStrategy}
              onChange={(e) => set('bidStrategy', e.target.value as GoogleAd['bidStrategy'])}
            >
              <option value="maximize_clicks">Maximize Clicks</option>
              <option value="target_cpa">Target CPA</option>
              <option value="target_roas">Target ROAS</option>
              <option value="manual_cpc">Manual CPC</option>
            </select>
          </div>
        </div>

        {ad.bidStrategy === 'target_cpa' && (
          <div className="field-group">
            <label>Target CPA ($)</label>
            <input
              type="number"
              value={ad.targetCpa || ''}
              onChange={(e) => set('targetCpa', e.target.value)}
              placeholder="50"
            />
          </div>
        )}

        <div className="field-group">
          <label>Location Targeting</label>
          <input
            type="text"
            value={ad.locationTargeting}
            onChange={(e) => set('locationTargeting', e.target.value)}
            placeholder="e.g. New York, NY or United States"
          />
          {errors.locationTargeting && <span className="error">{errors.locationTargeting}</span>}
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Start Date (optional)</label>
            <input
              type="date"
              value={ad.startDate || ''}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label>End Date (optional)</label>
            <input
              type="date"
              value={ad.endDate || ''}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Ad Copy</h3>

        <CopyAssistant
          platform="google"
          format="search"
          goal={ad.goal}
          keywords={keywordsRaw}
          onApply={handleCopyApply}
        />

        {([0, 1, 2] as const).map((i) => (
          <div className="field-group" key={i}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Headline {i + 1}</span>
              <CharCount current={ad.headlines[i].length} max={GOOGLE_LIMITS.headline} />
            </label>
            <input
              type="text"
              value={ad.headlines[i]}
              onChange={(e) => setHeadline(i, e.target.value)}
              placeholder={`Headline ${i + 1}`}
              maxLength={35}
            />
            {errors[`headline${i}`] && <span className="error">{errors[`headline${i}`]}</span>}
          </div>
        ))}

        {([0, 1] as const).map((i) => (
          <div className="field-group" key={i}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Description {i + 1}</span>
              <CharCount current={ad.descriptions[i].length} max={GOOGLE_LIMITS.description} />
            </label>
            <textarea
              value={ad.descriptions[i]}
              onChange={(e) => setDescription(i, e.target.value)}
              placeholder={`Description ${i + 1}`}
              rows={2}
              maxLength={95}
            />
            {errors[`desc${i}`] && <span className="error">{errors[`desc${i}`]}</span>}
          </div>
        ))}

        <div className="field-group">
          <label>Final URL</label>
          <input
            type="url"
            value={ad.finalUrl}
            onChange={(e) => set('finalUrl', e.target.value)}
            placeholder="https://yoursite.com/landing-page"
          />
          {errors.finalUrl && <span className="error">{errors.finalUrl}</span>}
        </div>

        {(ad.goal === 'leads' || ad.goal === 'calls') && (
          <div className="field-group">
            <label>Call Extension Phone (optional)</label>
            <input
              type="tel"
              value={ad.callExtension || ''}
              onChange={(e) => set('callExtension', e.target.value)}
              placeholder="(555) 555-5555"
            />
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>Keywords</h3>

        <div className="field-group">
          <label>Keywords (one per line)</label>
          <textarea
            value={keywordsRaw}
            onChange={(e) => setKeywordsRaw(e.target.value)}
            placeholder={'plumber near me\nemergency plumber\nbest plumber nyc'}
            rows={5}
          />
          {errors.keywords && <span className="error">{errors.keywords}</span>}
        </div>

        <div className="field-group">
          <label>Keyword Match Type</label>
          <select
            value={ad.keywordMatchType}
            onChange={(e) =>
              set('keywordMatchType', e.target.value as GoogleAd['keywordMatchType'])
            }
          >
            <option value="broad">Broad Match — widest reach</option>
            <option value="phrase">Phrase Match — "keyword"</option>
            <option value="exact">Exact Match — [keyword]</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Generate Instructions →
      </button>
    </form>
  );
}
