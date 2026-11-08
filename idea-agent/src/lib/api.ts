import { supabase } from './supabase';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(data.session?.access_token
        ? { Authorization: `Bearer ${data.session.access_token}` }
        : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({ error: 'Request failed.' }));
    throw new ApiError(result.error || `Request failed (${response.status}).`, response.status);
  }
  return response.json() as Promise<T>;
}
