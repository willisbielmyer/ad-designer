create table if not exists public.idea_agent_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  telegram_chat_id text,
  telegram_linked_at timestamptz,
  link_code text,
  link_code_expires_at timestamptz,
  enabled boolean not null default false,
  research_focus text not null default '',
  consent_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists idea_agent_settings_enabled
  on public.idea_agent_settings (enabled) where enabled = true;

create table if not exists public.idea_agent_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scheduled_for timestamptz not null,
  ideas jsonb not null,
  status text not null check (status in ('pending', 'delivered', 'failed')),
  telegram_message_id text,
  error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  unique (user_id, scheduled_for)
);

create index if not exists idea_agent_deliveries_user_time
  on public.idea_agent_deliveries (user_id, scheduled_for desc);

alter table public.idea_agent_settings enable row level security;
alter table public.idea_agent_deliveries enable row level security;

revoke all on public.idea_agent_settings from anon, authenticated;
revoke all on public.idea_agent_deliveries from anon, authenticated;
grant all on public.idea_agent_settings to service_role;
grant all on public.idea_agent_deliveries to service_role;
