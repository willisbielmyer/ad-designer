import { getUser, sendError, supabaseAdmin } from './_lib/service.js';

const COLUMNS = 'telegram_linked_at, enabled, research_focus, consent_at';

function intervalHours(): number {
  const n = Number.parseInt(process.env.IDEA_INTERVAL_HOURS ?? '', 10);
  return Number.isFinite(n) ? Math.min(24, Math.max(1, n)) : 6;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');
  try {
    const user = await getUser(req);
    if (!user) return sendError(res, 401, 'Sign in to manage your Idea Agent.');
    const db = supabaseAdmin();
    const withInterval = (row: Record<string, unknown> | null) => ({
      telegram_linked_at: null,
      enabled: false,
      research_focus: '',
      consent_at: null,
      ...(row ?? {}),
      interval_hours: intervalHours(),
    });

    if (req.method === 'GET') {
      const { data, error } = await db.from('idea_agent_settings').select(COLUMNS)
        .eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      return res.status(200).json(withInterval(data));
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
    const update: Record<string, unknown> = { user_id: user.id, updated_at: new Date().toISOString() };

    if (Object.hasOwn(body, 'research_focus')) {
      if (typeof body.research_focus !== 'string' || body.research_focus.length > 500) {
        return sendError(res, 400, 'Research focus must be 500 characters or fewer.');
      }
      update.research_focus = body.research_focus.trim();
    }

    if (Object.hasOwn(body, 'enabled')) {
      if (typeof body.enabled !== 'boolean') return sendError(res, 400, 'A valid delivery setting is required.');
      if (body.enabled) {
        if (body.consent !== true) return sendError(res, 400, 'Please consent to receive recurring Telegram messages.');
        const { data: current, error } = await db.from('idea_agent_settings')
          .select('telegram_chat_id, telegram_linked_at').eq('user_id', user.id).maybeSingle();
        if (error) throw error;
        if (!current?.telegram_chat_id || !current.telegram_linked_at) {
          return sendError(res, 400, 'Link Telegram before enabling delivery.');
        }
        update.enabled = true;
        update.consent_at = new Date().toISOString();
      } else {
        update.enabled = false;
      }
    }

    const { data, error } = await db.from('idea_agent_settings')
      .upsert(update, { onConflict: 'user_id' }).select(COLUMNS).single();
    if (error) throw error;
    return res.status(200).json(withInterval(data));
  } catch (error) {
    console.error('[idea-settings]', error);
    return sendError(res, 500, 'Could not save Idea Agent settings.');
  }
}
