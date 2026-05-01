import { useState, useEffect } from 'react';
import type { LSAAd } from '../types/ads';
import { LSA_CATEGORIES } from '../platforms/lsa';

interface Props {
  onSubmit: (ad: LSAAd) => void;
  onChange?: (ad: LSAAd) => void;
  initialValues?: LSAAd;
}

const defaultAd: LSAAd = {
  platform: 'lsa',
  goal: 'leads',
  businessName: '',
  businessCategory: '',
  serviceArea: '',
  weeklyBudget: '',
  phone: '',
  services: [],
  businessHours: 'Mon–Fri 8am–6pm',
};

export function LSAForm({ onSubmit, onChange, initialValues }: Props) {
  const init = initialValues ?? defaultAd;
  const [ad, setAd] = useState<LSAAd>(init);
  const [servicesRaw, setServicesRaw] = useState(init.services.join('\n'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onChange?.({
      ...ad,
      services: servicesRaw.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  }, [ad, servicesRaw]);

  function set<K extends keyof LSAAd>(key: K, value: LSAAd[K]) {
    setAd((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!ad.businessName) e.businessName = 'Required';
    if (!ad.businessCategory) e.businessCategory = 'Select a category';
    if (!ad.serviceArea) e.serviceArea = 'Required';
    if (!ad.weeklyBudget || isNaN(Number(ad.weeklyBudget))) e.weeklyBudget = 'Enter a valid number';
    if (!ad.phone) e.phone = 'Required';
    if (!servicesRaw.trim()) e.services = 'List at least one service';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...ad,
      services: servicesRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="ad-form">
      <div className="form-section lsa-notice">
        <p>
          <strong>Google Local Services Ads</strong> appear above all search results with a green
          "Google Guaranteed" badge. You pay per verified lead, not per click.
        </p>
      </div>

      <div className="form-section">
        <h3>Business Information</h3>

        <div className="field-group">
          <label>Business Name</label>
          <input
            type="text"
            value={ad.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            placeholder="e.g. Smith's Plumbing LLC"
          />
          {errors.businessName && <span className="error">{errors.businessName}</span>}
        </div>

        <div className="field-group">
          <label>Business Category</label>
          <select
            value={ad.businessCategory}
            onChange={(e) => set('businessCategory', e.target.value)}
          >
            <option value="">— Select category —</option>
            {LSA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.businessCategory && <span className="error">{errors.businessCategory}</span>}
        </div>

        <div className="field-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={ad.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="(555) 555-5555"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="field-group">
          <label>Service Area</label>
          <input
            type="text"
            value={ad.serviceArea}
            onChange={(e) => set('serviceArea', e.target.value)}
            placeholder="e.g. Atlanta, GA and surrounding 30 miles"
          />
          {errors.serviceArea && <span className="error">{errors.serviceArea}</span>}
        </div>

        <div className="field-group">
          <label>Business Hours</label>
          <input
            type="text"
            value={ad.businessHours}
            onChange={(e) => set('businessHours', e.target.value)}
            placeholder="Mon–Fri 8am–6pm, Sat 9am–2pm"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Services Offered (one per line)</h3>
        <div className="field-group">
          <textarea
            value={servicesRaw}
            onChange={(e) => setServicesRaw(e.target.value)}
            placeholder={'Drain cleaning\nWater heater installation\nLeak repair\nEmergency plumbing'}
            rows={5}
          />
          {errors.services && <span className="error">{errors.services}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Budget</h3>
        <div className="field-group">
          <label>Weekly Budget ($)</label>
          <input
            type="number"
            value={ad.weeklyBudget}
            onChange={(e) => set('weeklyBudget', e.target.value)}
            placeholder="200"
            min="50"
          />
          {errors.weeklyBudget && <span className="error">{errors.weeklyBudget}</span>}
          <small className="hint">
            LSA charges per verified lead. Typical lead cost: $15–$150 depending on category and
            market.
          </small>
        </div>
      </div>

      <div className="form-section">
        <h3>Verification Documents (for reference)</h3>
        <div className="field-group">
          <label>Business License Number (optional)</label>
          <input
            type="text"
            value={ad.licenseNumber || ''}
            onChange={(e) => set('licenseNumber', e.target.value)}
            placeholder="License #"
          />
        </div>
        <div className="field-group">
          <label>Insurance Provider (optional)</label>
          <input
            type="text"
            value={ad.insuranceProvider || ''}
            onChange={(e) => set('insuranceProvider', e.target.value)}
            placeholder="e.g. State Farm, Geico Commercial"
          />
        </div>
        <small className="hint">
          Google will ask for these during setup. Having them ready speeds up verification.
        </small>
      </div>

      <button type="submit" className="btn-primary">
        Generate Instructions →
      </button>
    </form>
  );
}
