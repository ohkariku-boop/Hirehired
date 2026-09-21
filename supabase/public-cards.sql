-- Public virtual business cards (run in Supabase SQL Editor)
-- Enables /c/[slug] for visitors beyond the publisher's browser

create table if not exists public.public_cards (
  slug text primary key,
  payload jsonb not null,
  is_public boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists public_cards_public_idx
  on public.public_cards (slug) where is_public = true;

alter table public.public_cards enable row level security;

-- Anyone can read published cards
drop policy if exists "Public read published cards" on public.public_cards;
create policy "Public read published cards"
  on public.public_cards for select
  using (is_public = true);

-- Anon/authenticated can publish or update by slug (MVP; tighten later with auth.uid())
drop policy if exists "Anyone can upsert cards" on public.public_cards;
create policy "Anyone can upsert cards"
  on public.public_cards for insert
  with check (true);

drop policy if exists "Anyone can update cards" on public.public_cards;
create policy "Anyone can update cards"
  on public.public_cards for update
  using (true);

drop policy if exists "Anyone can delete cards" on public.public_cards;
create policy "Anyone can delete cards"
  on public.public_cards for delete
  using (true);
