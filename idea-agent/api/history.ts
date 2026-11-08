import { getUser, sendError, supabaseAdmin } from './_lib/service.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed.');
  try {
    const user = await getUser(req);
    if (!user) return sendError(res, 401, 'Sign in to view your ideas.');
    const { data, error } = await supabaseAdmin().from('idea_agent_deliveries')
      .select('id, scheduled_for, ideas, delivered_at')
      .eq('user_id', user.id)
      .eq('status', 'delivered')
      .order('scheduled_for', { ascending: false })
      .limit(24);
    if (error) throw error;
    return res.status(200).json({ deliveries: data ?? [] });
  } catch (error) {
    console.error('[idea-history]', error);
    return sendError(res, 500, 'Could not load your idea history.');
  }
}
