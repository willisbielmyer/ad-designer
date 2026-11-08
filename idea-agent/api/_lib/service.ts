import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | undefined;

export function supabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

export async function getUser(req: any): Promise<{ id: string } | null> {
  const token = String(req.headers?.authorization ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  const allowedEmail = process.env.IDEA_AGENT_EMAIL?.trim().toLowerCase();
  if (!allowedEmail) throw new Error('IDEA_AGENT_EMAIL is not configured.');
  if (data.user.email?.toLowerCase() !== allowedEmail) return null;
  return { id: data.user.id };
}

export function sendError(res: any, status: number, error: string) {
  return res.status(status).json({ error });
}
