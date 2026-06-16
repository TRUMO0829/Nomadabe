create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  source_file text not null,
  title text not null,
  content text not null,
  chunk_index integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_file, chunk_index)
);

create index if not exists knowledge_base_source_file_idx
  on public.knowledge_base (source_file);

create index if not exists knowledge_base_title_idx
  on public.knowledge_base (title);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_knowledge_base_updated_at on public.knowledge_base;

create trigger set_knowledge_base_updated_at
before update on public.knowledge_base
for each row
execute function public.set_updated_at();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx
  on public.profiles (email);

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  customer_id uuid references public.profiles(id) on delete set null,
  trip_slug text,
  inquiry_type text not null default 'general'
    check (inquiry_type in ('trip', 'business', 'expo', 'custom', 'general')),
  travelers integer check (travelers is null or travelers >= 1),
  preferred_date text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

create index if not exists inquiries_trip_slug_idx
  on public.inquiries (trip_slug);

create table if not exists public.admin_trips (
  id text primary key,
  slug text not null unique,
  payload jsonb not null,
  translations jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.admin_trips
  add column if not exists translations jsonb not null default '{}'::jsonb;

create index if not exists admin_trips_sort_order_idx
  on public.admin_trips (sort_order);

drop trigger if exists set_admin_trips_updated_at on public.admin_trips;

create trigger set_admin_trips_updated_at
before update on public.admin_trips
for each row
execute function public.set_updated_at();

create table if not exists public.admin_services (
  id text primary key,
  payload jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_services_sort_order_idx
  on public.admin_services (sort_order);

drop trigger if exists set_admin_services_updated_at on public.admin_services;

create trigger set_admin_services_updated_at
before update on public.admin_services
for each row
execute function public.set_updated_at();

create table if not exists public.site_settings (
  id text primary key default 'default',
  settings jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null check (status in ('sent', 'queued', 'failed')),
  provider text not null check (provider in ('resend', 'local-log')),
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_logs_created_at_idx
  on public.email_logs (created_at desc);

create index if not exists email_logs_to_email_idx
  on public.email_logs (to_email);

create table if not exists public.admin_auth_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create index if not exists admin_auth_codes_lookup_idx
  on public.admin_auth_codes (email, code, expires_at desc)
  where used_at is null;
