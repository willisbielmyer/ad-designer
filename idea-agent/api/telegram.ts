import { randomBytes } from 'node:crypto';
import { getUser, sendError, supabaseAdmin } from './_lib/service.js';

const CODE_TTL_MS = 15 * 60_000;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed.');
  try {
    const user = await getUser(req);
    if (!user) return sendError(res, 401, 'Sign in to link Telegram.');
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return sendError(res, 500, 'Telegram is not configured.');
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
    const db = supabaseAdmin();

    if (body.action === 'reset') {
      const { error } = await db.from('idea_agent_settings').update({
        telegram_chat_id: null,
        telegram_linked_at: null,
        link_code: null,
        link_code_expires_at: null,
        enabled: false,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (body.action === 'start') {
      const me = await telegram(token, 'getMe');
      const username = me?.username;
      if (typeof username !== 'string') throw new Error('Could not read the Telegram bot username.');
      const code = randomBytes(8).toString('hex');
      const { error } = await db.from('idea_agent_settings').upsert({
        user_id: user.id,
        link_code: code,
        link_code_expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      return res.status(200).json({ link: `https://t.me/${username}?start=${code}`, bot: username });
    }

    if (body.action === 'check') {
      const { data: current, error: readError } = await db.from('idea_agent_settings')
        .select('link_code, link_code_expires_at').eq('user_id', user.id).maybeSingle();
      if (readError) throw readError;
      if (!current?.link_code || !current.link_code_expires_at ||
        new Date(current.link_code_expires_at).getTime() < Date.now()) {
        return sendError(res, 400, 'Start a new link first; the previous one expired.');
      }
      const updates: any[] = (await telegram(token, 'getUpdates', { timeout: 0, allowed_updates: ['message'] })) ?? [];
      const match = updates.find((u) =>
        u?.message?.chat?.type === 'private' && u.message.text === `/start ${current.link_code}`);
      if (!match) return sendError(res, 400, 'Not linked yet. Open the link, tap Start in Telegram, then check again.');
      const linkedAt = new Date().toISOString();
      const { error } = await db.from('idea_agent_settings').update({
        telegram_chat_id: String(match.message.chat.id),
        telegram_linked_at: linkedAt,
        link_code: null,
        link_code_expires_at: null,
        enabled: false,
        updated_at: linkedAt,
      }).eq('user_id', user.id);
      if (error) throw error;
      await telegram(token, 'sendMessage', {
        chat_id: match.message.chat.id,
        text: 'Linked! Return to the app and turn on idea delivery. You can pause it in the app at any time.',
      }).catch(() => undefined);
      return res.status(200).json({ telegram_linked_at: linkedAt });
    }
    return sendError(res, 400, 'Unknown Telegram action.');
  } catch (error) {
    console.error('[idea-telegram]', error);
    return sendError(res, 502, error instanceof Error ? error.message : 'Telegram linking failed.');
  }
}

async function telegram(token: string, method: string, payload?: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(typeof result.description === 'string' ? result.description : 'Telegram request failed.');
  }
  return result.result;
}
