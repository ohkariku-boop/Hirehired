-- Hirehired initial schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

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

-- Jobs
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete set null,
  title text not null,
  slug text,
  description text,
  location text,
  is_remote boolean default false,
  employment_type text, -- full-time, part-time, contract, internship
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  apply_url text not null,
  source text, -- 'career_page', 'greenhouse', 'lever', 'ashby', 'manual', etc.
  source_id text,
  posted_at timestamptz,
  expires_at timestamptz,
  is_active boolean default true,
  skills text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);
create index if not exists jobs_is_active_idx on public.jobs (is_active);
create index if not exists jobs_company_id_idx on public.jobs (company_id);

-- Applications (candidate side)
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

-- Watchlists (target companies)
create table if not exists public.watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, company_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.watchlists enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Companies & Jobs: public read
create policy "Companies are viewable by everyone"
  on public.companies for select using (true);

create policy "Jobs are viewable by everyone"
  on public.jobs for select using (true);

-- Applications: own only
create policy "Users can view own applications"
  on public.applications for select using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete using (auth.uid() = user_id);

-- Watchlists: own only
create policy "Users can manage own watchlists"
  on public.watchlists for all using (auth.uid() = user_id);

-- Auto-create profile on signup
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
