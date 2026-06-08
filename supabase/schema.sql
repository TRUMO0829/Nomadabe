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
