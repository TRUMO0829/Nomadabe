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
