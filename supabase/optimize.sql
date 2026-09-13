-- Hirehired DB optimization for daily peak performance
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Safe to re-run (IF NOT EXISTS / IF EXISTS guards)

-- ---------------------------------------------------------------------------
-- 1. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;      -- fuzzy / ILIKE acceleration
create extension if not exists unaccent;    -- optional text normalize

-- ---------------------------------------------------------------------------
-- 2. Align jobs table with product filters (Tech / Compliance, level, region)
-- ---------------------------------------------------------------------------
alter table public.jobs
  add column if not exists category text,           -- Engineering | Compliance | Product | ...
  add column if not exists region text,             -- APAC | Global
  add column if not exists level text,              -- Mid | Senior | Director | ...
  add column if not exists company_name text,       -- denormalized for search without join
  add column if not exists tags text[] default '{}',
  add column if not exists track text;              -- tech | compliance (derived)

-- Backfill track from category when empty
update public.jobs
set track = case
  when category ilike '%compliance%' or category ilike '%aml%' or category ilike '%kyc%'
    then 'compliance'
  when category is not null then 'tech'
  else track
end
where track is null and category is not null;

-- ---------------------------------------------------------------------------
-- 3. Partial indexes — only active jobs (daily browse path)
-- ---------------------------------------------------------------------------
drop index if exists jobs_is_active_idx;
create index if not exists jobs_active_posted_idx
  on public.jobs (posted_at desc nulls last)
  where is_active = true;

create index if not exists jobs_active_track_posted_idx
  on public.jobs (track, posted_at desc nulls last)
  where is_active = true;

create index if not exists jobs_active_region_posted_idx
  on public.jobs (region, posted_at desc nulls last)
  where is_active = true;

create index if not exists jobs_active_level_posted_idx
  on public.jobs (level, posted_at desc nulls last)
  where is_active = true;

create index if not exists jobs_active_employment_type_idx
  on public.jobs (employment_type)
  where is_active = true;

create index if not exists jobs_active_remote_idx
  on public.jobs (is_remote)
  where is_active = true and is_remote = true;

-- Composite for common filter: track + region + level
create index if not exists jobs_active_track_region_level_idx
  on public.jobs (track, region, level, posted_at desc nulls last)
  where is_active = true;

-- ---------------------------------------------------------------------------
-- 4. Text search — trigram + full-text
-- ---------------------------------------------------------------------------
-- Fast ILIKE / contains on title, company, location
create index if not exists jobs_title_trgm_idx
  on public.jobs using gin (title gin_trgm_ops);

create index if not exists jobs_company_name_trgm_idx
  on public.jobs using gin (company_name gin_trgm_ops)
  where company_name is not null;

create index if not exists jobs_location_trgm_idx
  on public.jobs using gin (location gin_trgm_ops)
  where location is not null;

-- Full-text search vector (title + company + location + description head)
alter table public.jobs
  add column if not exists search_tsv tsvector;

create or replace function public.jobs_search_tsv_update()
returns trigger as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.company_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(left(new.description, 2000), '')), 'C');
  return new;
end;
$$ language plpgsql;

drop trigger if exists jobs_search_tsv_trigger on public.jobs;
create trigger jobs_search_tsv_trigger
  before insert or update of title, company_name, location, description
  on public.jobs
  for each row execute function public.jobs_search_tsv_update();

-- Backfill tsv for existing rows
update public.jobs set search_tsv =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(company_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(location, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(left(description, 2000), '')), 'C')
where search_tsv is null;

create index if not exists jobs_search_tsv_idx
  on public.jobs using gin (search_tsv);

-- ---------------------------------------------------------------------------
-- 5. Array / tag indexes
-- ---------------------------------------------------------------------------
create index if not exists jobs_skills_gin_idx
  on public.jobs using gin (skills);

create index if not exists jobs_tags_gin_idx
  on public.jobs using gin (tags);

-- ---------------------------------------------------------------------------
-- 6. Dedup + daily upsert support
-- ---------------------------------------------------------------------------
-- One row per external posting (source + source_id)
create unique index if not exists jobs_source_source_id_uidx
  on public.jobs (source, source_id)
  where source is not null and source_id is not null;

create index if not exists jobs_source_idx
  on public.jobs (source)
  where source is not null;

create index if not exists jobs_apply_url_idx
  on public.jobs (apply_url);

-- ---------------------------------------------------------------------------
-- 7. FK / join helpers
-- ---------------------------------------------------------------------------
create index if not exists jobs_company_id_idx
  on public.jobs (company_id)
  where company_id is not null;

create index if not exists companies_slug_idx
  on public.companies (slug);

create index if not exists companies_name_trgm_idx
  on public.companies using gin (name gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 8. Applications & watchlists (candidate daily use)
-- ---------------------------------------------------------------------------
create index if not exists applications_user_status_idx
  on public.applications (user_id, status);

create index if not exists applications_job_id_idx
  on public.applications (job_id);

create index if not exists applications_user_updated_idx
  on public.applications (user_id, updated_at desc);

create index if not exists watchlists_user_id_idx
  on public.watchlists (user_id);

create index if not exists watchlists_company_id_idx
  on public.watchlists (company_id);

-- ---------------------------------------------------------------------------
-- 9. Profiles
-- ---------------------------------------------------------------------------
create index if not exists profiles_role_idx
  on public.profiles (role);

create index if not exists profiles_skills_gin_idx
  on public.profiles using gin (skills);

-- ---------------------------------------------------------------------------
-- 10. updated_at auto-touch
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 11. Stats for planner (run after bulk daily load)
-- ---------------------------------------------------------------------------
analyze public.jobs;
analyze public.companies;
analyze public.applications;
analyze public.watchlists;
analyze public.profiles;

-- ---------------------------------------------------------------------------
-- 12. Example peak queries (for reference — do not need to run)
-- ---------------------------------------------------------------------------
-- Active Compliance APAC senior, newest first:
--   select * from jobs
--   where is_active and track = 'compliance' and region = 'APAC' and level = 'Senior'
--   order by posted_at desc nulls last
--   limit 20;
--
-- Full-text search:
--   select * from jobs
--   where is_active and search_tsv @@ plainto_tsquery('english', 'UOB KYC')
--   order by ts_rank(search_tsv, plainto_tsquery('english', 'UOB KYC')) desc
--   limit 20;
--
-- Trigram fallback:
--   select * from jobs
--   where is_active and (title ilike '%compliance%' or company_name ilike '%UOB%')
--   order by posted_at desc limit 20;

select 'Hirehired optimize.sql applied' as status;
