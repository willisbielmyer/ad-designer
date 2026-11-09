import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { api, ApiError } from './lib/api';
import { supabase, supabaseConfigured } from './lib/supabase';

type Settings = {
  telegram_linked_at: string | null;
  enabled: boolean;
  research_focus: string;
  consent_at: string | null;
  interval_hours: number;
};

type Idea = {
  category: 'product_service' | 'problem_solver' | 'creative';
  title: string;
  summary: string;
  target_customer: string;
  differentiation: string;
  competitor_level: 'low' | 'medium' | 'high';
  novelty?: 'none_found' | 'partial';
  searches?: string[];
  competitor_evidence: string;
  sources: { title: string; url: string }[];
};

type Delivery = {
  id: string;
  scheduled_for: string;
  ideas: Idea[];
  delivered_at: string | null;
};

const EMPTY_SETTINGS: Settings = {
  telegram_linked_at: null,
  enabled: false,
  research_focus: '',
  consent_at: null,
  interval_hours: 6,
};
const allowedEmail = import.meta.env.VITE_IDEA_AGENT_EMAIL as string | undefined;

const CATEGORY_LABELS: Record<Idea['category'], string> = {
  product_service: 'Product or service',
  problem_solver: 'Problem solver',
  creative: 'Creative idea',
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [history, setHistory] = useState<Delivery[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [linkUrl, setLinkUrl] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setSettings(EMPTY_SETTINGS);
      setHistory([]);
      return;
    }
    let active = true;
    Promise.all([
      api<Settings>('/api/settings'),
      api<{ deliveries: Delivery[] }>('/api/history'),
    ]).then(([nextSettings, result]) => {
      if (!active) return;
      setSettings(nextSettings);
      setHistory(result.deliveries);
    }).catch((e: unknown) => {
      if (active) setError(messageOf(e));
    });
    return () => { active = false; };
  }, [session]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (authMode === 'signup') {
        if (!allowedEmail) throw new Error('The owner email is not configured for this app.');
        if (email.trim().toLowerCase() !== allowedEmail.trim().toLowerCase()) {
          throw new Error('This private app is only available to its configured owner.');
        }
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        if (!data.session) setNotice('Check your email to confirm your account, then sign in.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function startLink() {
    setBusy(true);
    setNotice('');
    setError('');
    try {
      const result = await api<{ link: string }>('/api/telegram', { action: 'start' });
      setLinkUrl(result.link);
      window.open(result.link, '_blank', 'noopener');
      setNotice('Tap Start in Telegram, then come back and press "I pressed Start".');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirmLink() {
    setBusy(true);
    setNotice('');
    setError('');
    try {
      const result = await api<{ telegram_linked_at: string }>('/api/telegram', { action: 'check' });
      setSettings((current) => ({ ...current, telegram_linked_at: result.telegram_linked_at }));
      setLinkUrl('');
      setNotice('Telegram linked. You can now turn on delivery.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function resetLink() {
    setBusy(true);
    setNotice('');
    setError('');
    try {
      await api('/api/telegram', { action: 'reset' });
      setSettings((current) => ({ ...current, telegram_linked_at: null, enabled: false }));
      setLinkUrl('');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function saveFocus(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    setError('');
    try {
      const result = await api<Settings>('/api/settings', { research_focus: settings.research_focus });
      setSettings(result);
      setNotice('Research preferences saved.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function updateDelivery(enabled: boolean) {
    setBusy(true);
    setNotice('');
    setError('');
    try {
      const result = await api<Settings>('/api/settings', { enabled, consent });
      setSettings(result);
      setNotice(enabled ? 'Idea messages are on.' : 'Idea messages are paused.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
  }

  if (authLoading) return <main className="loading">Loading Idea Signal…</main>;

  if (!session) {
    return (
      <main className="auth-shell">
        <div className="auth-panel">
          <Brand />
          <span className="eyebrow">YOUR NEXT OPPORTUNITY IS OUT THERE</span>
          <h1>Fresh ideas.<br /><span>On repeat.</span></h1>
          <p className="muted">Get three research-backed business concepts on Telegram, on a schedule.</p>
          {!supabaseConfigured && <div className="alert error">Set the Supabase browser environment variables to enable sign-in.</div>}
          {error && <div className="alert error">{error}</div>}
          {notice && <div className="alert success">{notice}</div>}
          <form onSubmit={submitAuth} className="form-stack">
            <label>Email<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>Password<input type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button className="primary-button" disabled={busy || !supabaseConfigured}>{busy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}<span aria-hidden="true">→</span></button>
          </form>
          <button className="text-button" onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setError(''); setNotice(''); }}>
            {authMode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </button>
          <p className="fine-print">Messages are sent through your own Telegram bot.</p>
        </div>
        <div className="auth-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="idea-orb"><span>✳</span><small>IDEA<br />SIGNAL</small></div>
          <div className="floating-note note-top">01 · New demand detected</div>
          <div className="floating-note note-bottom">Low competition · 3 sources</div>
        </div>
      </main>
    );
  }

  const isLinked = Boolean(settings.telegram_linked_at);
  const cadence = settings.interval_hours === 1 ? 'hour' : `${settings.interval_hours} hours`;

  return (
    <main className="app-shell">
      <header className="topbar">
        <Brand />
        <div className="user-actions">
          <span className={`status-pill ${settings.enabled ? 'on' : ''}`}><i />{settings.enabled ? 'Agent active' : 'Agent paused'}</span>
          <button className="text-button" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <section className="welcome">
        <div>
          <span className="eyebrow">YOUR PERSONAL MARKET SCOUT</span>
          <h1>Make room for <span>what’s next.</span></h1>
          <p>Three distinct, web-researched business ideas land in Telegram every {cadence}.</p>
        </div>
        <div className="next-drop"><span className="pulse-dot" /> EVERY <strong>{cadence}</strong></div>
      </section>

      {error && <div className="alert error">{error}<button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      {notice && <div className="alert success">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div>}

      <section className="setup-grid">
        <article className="panel phone-panel">
          <div className="panel-heading"><span className="step">01</span><div><h2>Where should we message?</h2><p>Link your Telegram before enabling delivery.</p></div></div>
          {!isLinked ? (
            <div className="inline-form">
              <button className="secondary-button" onClick={startLink} disabled={busy}>Link Telegram</button>
              {linkUrl && <>
                <a className="text-button" href={linkUrl} target="_blank" rel="noreferrer">Open Telegram link</a>
                <button className="secondary-button" onClick={confirmLink} disabled={busy}>I pressed Start</button>
              </>}
            </div>
          ) : (
            <div className="verified-number"><span className="checkmark">✓</span><div><strong>Telegram linked</strong><small>Ideas will arrive in your bot chat</small></div><button className="text-button" onClick={resetLink} disabled={busy}>Change</button></div>
          )}
        </article>

        <article className="panel focus-panel">
          <div className="panel-heading"><span className="step">02</span><div><h2>What should we explore?</h2><p>Optional: guide the research toward your interests.</p></div></div>
          <form onSubmit={saveFocus} className="focus-form">
            <label className="sr-only" htmlFor="focus">Industries, skills, locations, or constraints</label>
            <textarea id="focus" maxLength={500} placeholder="For example: practical AI tools for independent restaurants in the US; low startup costs; no healthcare." value={settings.research_focus} onChange={(e) => setSettings((current) => ({ ...current, research_focus: e.target.value }))} />
            <div className="focus-footer"><span>{settings.research_focus.length}/500 · Leave blank for cross-industry ideas</span><button className="text-button save-link" disabled={busy}>Save focus</button></div>
          </form>
        </article>
      </section>

      <section className="delivery-panel">
        <div className="delivery-copy">
          <span className="eyebrow">03 · DELIVERY</span>
          <h2>{settings.enabled ? 'Your signal is live.' : 'Turn on your signal.'}</h2>
          <p>One message every {cadence} with one product or service, one problem solver, and one creative concept.</p>
        </div>
        <div className="delivery-actions">
          {!settings.enabled && <label className="consent-check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I agree to receive recurring automated idea messages on my linked Telegram. I can pause delivery here any time.</span></label>}
          {settings.enabled
            ? <button className="pause-button" disabled={busy} onClick={() => updateDelivery(false)}>Pause texts</button>
            : <button className="primary-button" disabled={busy || !isLinked || !consent} onClick={() => updateDelivery(true)}>Start idea messages <span aria-hidden="true">↗</span></button>}
        </div>
      </section>

      <section className="history-section">
        <div className="section-heading"><div><span className="eyebrow">YOUR IDEA ARCHIVE</span><h2>Recent deliveries</h2></div><span className="history-note">New research on a schedule</span></div>
        {history.length === 0 ? (
          <div className="empty-state"><span>✳</span><strong>Your first ideas will show up here.</strong><p>Link Telegram and turn on the agent to start your research feed.</p></div>
        ) : (
          <div className="delivery-list">
            {history.map((delivery) => (
              <article className="history-card" key={delivery.id}>
                <div className="delivery-time"><span>{new Date(delivery.scheduled_for).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><small>{new Date(delivery.scheduled_for).toLocaleDateString([], { month: 'short', day: 'numeric' })}</small></div>
                <div className="idea-list">
                  {delivery.ideas.map((idea, index) => (
                    <div className="idea-row" key={`${delivery.id}-${index}`}>
                      <div className="idea-type">{CATEGORY_LABELS[idea.category]}</div>
                      <div className="idea-content"><h3>{idea.title}</h3><p>{idea.summary}</p><small>For {idea.target_customer}</small>
                        <div className="competition"><span className={`competition-dot ${idea.competitor_level}`} />{idea.novelty === 'none_found' ? `Novel: no existing match in ${idea.searches?.length ?? 0} searches` : idea.novelty === 'partial' ? 'Partial overlap with existing' : `${idea.competitor_level} competition`} <span className="evidence">{idea.competitor_evidence}</span></div>
                        <p className="differentiation">{idea.differentiation}</p>
                        {idea.sources.length > 0 && <div className="sources">{idea.novelty ? 'Closest found' : 'Research'}: {idea.sources.map((source, i) => <a key={`${source.url}-${i}`} href={source.url} target="_blank" rel="noreferrer">{source.title || new URL(source.url).hostname}</a>)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="app-footer">
        <p>Competitor levels are estimates from sampled web searches, not an exhaustive market census. No research can guarantee an idea has never been tried. Validate demand and competition before investing.</p>
        <span>Built to spark, not promise.</span>
      </footer>
    </main>
  );
}

function Brand() {
  return <a className="brand" href="/" aria-label="Idea Signal home"><span className="brand-mark">✳</span><span>idea<span className="brand-light">signal</span><small>BUSINESS IDEAS, IN MOTION</small></span></a>;
}

function messageOf(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return error instanceof Error ? error.message : 'Something went wrong.';
}
