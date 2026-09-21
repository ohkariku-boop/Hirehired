-- Strategy A: exportable profile + claims-ready schema
-- Run in Supabase SQL Editor after schema.sql

-- Extend profiles for portable candidate identity (still centralized storage;
-- export package is what travels off-platform)
alter table public.profiles
  add column if not exists summary text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists portfolio_url text,
  add column if not exists preferred_locations text[] default '{}',
  add column if not exists open_to text[] default '{}'; -- permanent, contract, remote

-- Claims: optional attestations / links. status is honest, not fake "verified by Hirehired"
create table if not exists public.claims (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  claim_type text not null, -- skill | employment | education | cert | contribution | link
  title text not null,
  description text,
  evidence_url text,
  issuer_name text,           -- optional human issuer name
  issuer_did text,            -- reserved for future VC / DID issuers
  proof_json jsonb,           -- reserved for signed credential payload
  status text not null default 'self_reported'
    check (status in ('self_reported', 'linked', 'issuer_signed', 'revoked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists claims_user_id_idx on public.claims (user_id);
create index if not exists claims_type_idx on public.claims (claim_type);
create index if not exists claims_status_idx on public.claims (status);

alter table public.claims enable row level security;

create policy "Users can view own claims"
  on public.claims for select using (auth.uid() = user_id);
create policy "Users can insert own claims"
  on public.claims for insert with check (auth.uid() = user_id);
create policy "Users can update own claims"
  on public.claims for update using (auth.uid() = user_id);
create policy "Users can delete own claims"
  on public.claims for delete using (auth.uid() = user_id);

drop trigger if exists claims_set_updated_at on public.claims;
create trigger claims_set_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();
