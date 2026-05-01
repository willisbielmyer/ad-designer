import { useState, useEffect } from 'react';
import type { TikTokAd, TikTokCTA } from '../types/ads';
import { CharCount } from './CharCount';
import { CopyAssistant } from './CopyAssistant';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  onSubmit: (ad: TikTokAd) => void;
  onChange?: (ad: TikTokAd) => void;
  initialValues?: TikTokAd;
}

const CAPTION_LIMIT = 100;

const defaultAd: TikTokAd = {
  platform: 'tiktok',
  goal: 'traffic',
  campaignName: '',
  dailyBudget: '',
  videoDescription: '',
  videoDuration: '15-30s',
  caption: '',
  hashtags: '',
  ctaButton: 'Learn More',
  destinationUrl: '',
  ageMin: 18,
  ageMax: 55,
  genderTargeting: 'all',
  locationTargeting: '',
  interestTargeting: '',
};

export function TikTokForm({ onSubmit, onChange, initialValues }: Props) {
  const init = initialValues ?? defaultAd;
  const [ad, setAd] = useState<TikTokAd>(init);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onChange?.(ad);
  }, [ad]);

  function set<K extends keyof TikTokAd>(key: K, value: TikTokAd[K]) {
    setAd((prev) => ({ ...prev, [key]: value }));
  }

  function handleCopyApply(field: string, _slotIndex: number, value: string) {
    if (field === 'caption') set('caption', value);
    if (field === 'hashtags') set('hashtags', value);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!ad.campaignName) e.campaignName = 'Required';
    if (!ad.dailyBudget || isNaN(Number(ad.dailyBudget))) e.dailyBudget = 'Enter a valid number';
    if (!ad.videoDescription) e.videoDescription = 'Required';
    if (!ad.caption) e.caption = 'Required';
    if (ad.caption.length > CAPTION_LIMIT) e.caption = 'Too long';
    if (!ad.destinationUrl) e.destinationUrl = 'Required';
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
          <select value={ad.goal} onChange={(e) => set('goal', e.target.value as TikTokAd['goal'])}>
            <option value="traffic">Website Traffic</option>
            <option value="leads">Lead Generation</option>
            <option value="awareness">Brand Awareness</option>
            <option value="app_installs">App Installs</option>
          </select>
        </div>

        <div className="field-group">
          <label>Campaign Name</label>
          <input
            type="text"
            value={ad.campaignName}
            onChange={(e) => set('campaignName', e.target.value)}
            placeholder="e.g. Summer Sale — TikTok"
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
            <label>Location</label>
            <input
              type="text"
              value={ad.locationTargeting}
              onChange={(e) => set('locationTargeting', e.target.value)}
              placeholder="e.g. United States"
            />
            {errors.locationTargeting && <span className="error">{errors.locationTargeting}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Video Content</h3>

        <div className="field-group">
          <label>Video Description</label>
          <textarea
            value={ad.videoDescription}
            onChange={(e) => set('videoDescription', e.target.value)}
            placeholder="Describe the video you'll create — what happens, who's in it, the hook in the first 3 seconds"
            rows={3}
          />
          {errors.videoDescription && <span className="error">{errors.videoDescription}</span>}
          <small className="hint">Shoot vertically (9:16), 1080×1920 px. Hook viewers in the first 3 seconds.</small>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Video Duration</label>
            <select value={ad.videoDuration} onChange={(e) => set('videoDuration', e.target.value as TikTokAd['videoDuration'])}>
              <option value="5-15s">5–15 seconds (quick hook)</option>
              <option value="15-30s">15–30 seconds (recommended)</option>
              <option value="30-60s">30–60 seconds (story-driven)</option>
            </select>
          </div>
          <div className="field-group">
            <label>Music / Sound (optional)</label>
            <input
              type="text"
              value={ad.musicDescription || ''}
              onChange={(e) => set('musicDescription', e.target.value)}
              placeholder="e.g. Trending upbeat pop, voiceover only"
            />
          </div>
        </div>

        <ImageGenerator
          platform="tiktok"
          format="in-feed"
          initialDescription={ad.videoDescription}
          onGenerated={(url) => set('generatedImageUrl', url)}
        />
      </div>

      <div className="form-section">
        <h3>Ad Copy</h3>

        <CopyAssistant
          platform="tiktok"
          format="in-feed"
          goal={ad.goal}
          onApply={handleCopyApply}
        />

        <div className="field-group" style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Caption</span>
            <CharCount current={ad.caption.length} max={CAPTION_LIMIT} />
          </label>
          <textarea
            value={ad.caption}
            onChange={(e) => set('caption', e.target.value)}
            placeholder="Short, punchy caption — the hook that makes people stop scrolling"
            rows={2}
            maxLength={103}
          />
          {errors.caption && <span className="error">{errors.caption}</span>}
        </div>

        <div className="field-group">
          <label>Hashtags</label>
          <input
            type="text"
            value={ad.hashtags}
            onChange={(e) => set('hashtags', e.target.value)}
            placeholder="#fyp #smallbusiness #trending"
          />
          <small className="hint">Use 3–5 hashtags: mix trending + niche-specific</small>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>CTA Button</label>
            <select value={ad.ctaButton} onChange={(e) => set('ctaButton', e.target.value as TikTokCTA)}>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
              <option value="Book Now">Book Now</option>
              <option value="Contact Us">Contact Us</option>
              <option value="Get Quote">Get Quote</option>
              <option value="Subscribe">Subscribe</option>
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
      </div>

      <div className="form-section">
        <h3>Audience</h3>

        <div className="field-row">
          <div className="field-group">
            <label>Min Age</label>
            <input type="number" value={ad.ageMin} onChange={(e) => set('ageMin', Number(e.target.value))} min={18} max={55} />
          </div>
          <div className="field-group">
            <label>Max Age</label>
            <input type="number" value={ad.ageMax} onChange={(e) => set('ageMax', Number(e.target.value))} min={18} max={55} />
          </div>
          <div className="field-group">
            <label>Gender</label>
            <select value={ad.genderTargeting} onChange={(e) => set('genderTargeting', e.target.value as TikTokAd['genderTargeting'])}>
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label>Interest Targeting (optional)</label>
          <input
            type="text"
            value={ad.interestTargeting}
            onChange={(e) => set('interestTargeting', e.target.value)}
            placeholder="e.g. Home & Garden, DIY, Interior Design"
          />
          <small className="hint">Leave blank to let TikTok's algorithm find your audience automatically</small>
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Generate Instructions →
      </button>
    </form>
  );
}
