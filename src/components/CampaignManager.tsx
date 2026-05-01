import { useState } from 'react';
import type { SavedCampaign, AnyAd, Platform } from '../types/ads';
import { getCampaigns, saveCampaign, deleteCampaign, formatSavedDate } from '../utils/storage';

interface Props {
  currentAd: AnyAd | null;
  currentPlatform: Platform;
  onLoad: (campaign: SavedCampaign) => void;
}

const PLATFORM_COLOR: Record<Platform, string> = {
  google: '#4285F4',
  meta: '#0866FF',
  lsa: '#34A853',
};

const PLATFORM_ICON: Record<Platform, string> = {
  google: 'G',
  meta: 'f',
  lsa: '✓',
};

export function CampaignManager({ currentAd, currentPlatform, onLoad }: Props) {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>(getCampaigns);
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function refresh() {
    setCampaigns(getCampaigns());
  }

  function handleSave() {
    if (!currentAd) return;
    const name = saveName.trim() || currentAd.platform === 'google'
      ? (currentAd as any).campaignName || 'Untitled Campaign'
      : (currentAd as any).campaignName || (currentAd as any).businessName || 'Untitled Campaign';
    saveCampaign(name || 'Untitled Campaign', currentPlatform, currentAd);
    setSaveName('');
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    refresh();
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this campaign?')) return;
    deleteCampaign(id);
    refresh();
  }

  return (
    <div className="campaign-manager">
      <div className="cm-bar">
        {/* Save controls */}
        <div className="cm-save-area">
          {saving ? (
            <>
              <input
                className="cm-name-input"
                type="text"
                placeholder="Campaign name…"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <button className="cm-btn cm-btn-confirm" onClick={handleSave}>Save</button>
              <button className="cm-btn cm-btn-cancel" onClick={() => setSaving(false)}>✕</button>
            </>
          ) : (
            <button
              className={`cm-btn cm-btn-save ${justSaved ? 'cm-btn-saved' : ''}`}
              onClick={() => setSaving(true)}
              disabled={!currentAd}
            >
              {justSaved ? '✓ Saved' : '↓ Save Campaign'}
            </button>
          )}
        </div>

        {/* Open saved list */}
        {campaigns.length > 0 && (
          <button
            className="cm-btn cm-btn-open"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Hide' : `Saved (${campaigns.length})`}
          </button>
        )}
      </div>

      {open && campaigns.length > 0 && (
        <div className="cm-list">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="cm-item"
              onClick={() => { onLoad(c); setOpen(false); }}
            >
              <span
                className="cm-item-badge"
                style={{ background: PLATFORM_COLOR[c.platform] }}
              >
                {PLATFORM_ICON[c.platform]}
              </span>
              <div className="cm-item-info">
                <div className="cm-item-name">{c.name}</div>
                <div className="cm-item-date">{formatSavedDate(c.savedAt)}</div>
              </div>
              <button
                className="cm-item-delete"
                onClick={(e) => handleDelete(c.id, e)}
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
