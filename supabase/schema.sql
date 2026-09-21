-- Hirehired initial schema (optimized for daily job browse + search)
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  headline text,
  location text,
  avatar_url text,
  role text check (role in ('candidate', 'employer', 'both')) default 'candidate',
  resume_url text,
  skills text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_skills_gin_idx on public.profiles using gin (skills);

-- Companies
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  website text,
  careers_url text,
  logo_url text,
  description text,
  industry text,
  size text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists companies_slug_idx on public.companies (slug);
create index if not exists companies_name_trgm_idx on public.companies using gin (name gin_trgm_ops);

-- Jobs
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  title text not null,
  slug text,
  description text,
  location text,
  region text,
  category text,
  track text,
  level text,
  is_remote boolean default false,
  employment_type text,
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  apply_url text not null,
  source text,
  source_id text,
  posted_at timestamptz,
  expires_at timestamptz,
  is_active boolean default true,
  skills text[] default '{}',
  tags text[] default '{}',
  search_tsv tsvector,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Partial indexes for active listings (primary browse path)
create index if not exists jobs_active_posted_idx
  on public.jobs (posted_at desc nulls last) where is_active = true;
create index if not exists jobs_active_track_posted_idx
  on public.jobs (track, posted_at desc nulls last) where is_active = true;
create index if not exists jobs_active_region_posted_idx
  on public.jobs (region, posted_at desc nulls last) where is_active = true;
create index if not exists jobs_active_level_posted_idx
  on public.jobs (level, posted_at desc nulls last) where is_active = true;
create index if not exists jobs_active_employment_type_idx
  on public.jobs (employment_type) where is_active = true;
create index if not exists jobs_active_remote_idx
  on public.jobs (is_remote) where is_active = true and is_remote = true;
create index if not exists jobs_active_track_region_level_idx
  on public.jobs (track, region, level, posted_at desc nulls last) where is_active = true;

-- Text
create index if not exists jobs_title_trgm_idx on public.jobs using gin (title gin_trgm_ops);
create index if not exists jobs_company_name_trgm_idx on public.jobs using gin (company_name gin_trgm_ops) where company_name is not null;
create index if not exists jobs_location_trgm_idx on public.jobs using gin (location gin_trgm_ops) where location is not null;
create index if not exists jobs_search_tsv_idx on public.jobs using gin (search_tsv);

-- Arrays / dedup / FK
create index if not exists jobs_skills_gin_idx on public.jobs using gin (skills);
create index if not exists jobs_tags_gin_idx on public.jobs using gin (tags);
create unique index if not exists jobs_source_source_id_uidx
  on public.jobs (source, source_id) where source is not null and source_id is not null;
create index if not exists jobs_source_idx on public.jobs (source) where source is not null;
create index if not exists jobs_apply_url_idx on public.jobs (apply_url);
create index if not exists jobs_company_id_idx on public.jobs (company_id) where company_id is not null;

-- Applications
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  status text check (status in ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')) default 'saved',
  notes text,
  applied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, job_id)
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_user_status_idx on public.applications (user_id, status);
create index if not exists applications_job_id_idx on public.applications (job_id);
create index if not exists applications_user_updated_idx on public.applications (user_id, updated_at desc);

-- Watchlists
create table if not exists public.watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, company_id)
);

create index if not exists watchlists_user_id_idx on public.watchlists (user_id);
create index if not exists watchlists_company_id_idx on public.watchlists (company_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.watchlists enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Companies are viewable by everyone"
  on public.companies for select using (true);
create policy "Jobs are viewable by everyone"
  on public.jobs for select using (true);
create policy "Users can view own applications"
  on public.applications for select using (auth.uid() = user_id);
create policy "Users can insert own applications"
  on public.applications for insert with check (auth.uid() = user_id);
create policy "Users can update own applications"
  on public.applications for update using (auth.uid() = user_id);
create policy "Users can delete own applications"
  on public.applications for delete using (auth.uid() = user_id);
create policy "Users can manage own watchlists"
  on public.watchlists for all using (auth.uid() = user_id);

-- Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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


-- Strategy A: claims-ready (see also strategy-a-profile.sql)
alter table public.profiles
  add column if not exists summary text,
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists portfolio_url text,
  add column if not exists preferred_locations text[] default '{}',
  add column if not exists open_to text[] default '{}';
