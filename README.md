# Hirehired

The smarter platform to **hire** and **get hired**.

Discover jobs posted directly on company career pages — often before they appear on LinkedIn or Indeed.

## Tech Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Supabase (Auth + Postgres + RLS)

## Setup

1. Clone & install:
   ```bash
   git clone https://github.com/ohkariku-boop/Hirehired.git
   cd Hirehired
   npm install
   ```

2. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

3. Run schema + seed in Supabase SQL Editor:
   - Paste & run `supabase/schema.sql`
   - Paste & run `supabase/seed.sql`

4. Start:
   ```bash
   npm run dev
   ```

## Features (current)

- ✅ Landing page
- ✅ Auth (signup / login / signout)
- ✅ Dashboard
- ✅ Jobs listing (connected to Supabase + fallback mock)
- ✅ Save job → Applications tracker
- ✅ Sample seed data
- ⏳ Real career-page job ingestion
- ⏳ AI matching & resume tools
- ⏳ Employer posting flow

## Project structure

```
src/
  app/
    page.tsx              # Landing
    login/ signup/        # Auth
    jobs/                 # Job board
    dashboard/            # User home + applications
  lib/supabase/           # Clients
supabase/
  schema.sql
  seed.sql
```
