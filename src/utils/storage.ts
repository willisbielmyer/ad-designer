import type { SavedCampaign, AnyAd, Platform } from '../types/ads';

const KEY = 'ad-designer-campaigns';

export function getCampaigns(): SavedCampaign[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedCampaign[]) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(name: string, platform: Platform, ad: AnyAd): SavedCampaign {
  const campaigns = getCampaigns();
  const entry: SavedCampaign = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    platform,
    savedAt: new Date().toISOString(),
    ad,
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...campaigns]));
  return entry;
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(campaigns));
}

export function formatSavedDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
