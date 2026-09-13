# Hirehired

The smarter platform to **hire** and **get hired**.

Discover jobs posted directly on company career pages — often before they appear on LinkedIn or Indeed. Higher signal, less competition, better outcomes.

## Tech Stack (MVP)

- **Next.js 15** (App Router) + TypeScript + Tailwind
- **Supabase** (Auth + Postgres + RLS)
- AI features (OpenRouter) — next

## Getting Started

1. Clone the repo
2. Copy `.env.example` → `.env.local` and fill in your Supabase keys
3. Install dependencies:

```bash
npm install
```

4. Run the schema in Supabase Dashboard → SQL Editor (paste contents of `supabase/schema.sql`)
5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current Status

- ✅ Landing page
- ✅ Basic jobs listing (mock data)
- ✅ Supabase client setup (browser + server + admin)
- ✅ Database schema (profiles, companies, jobs, applications, watchlists)
- ⏳ Auth UI (login / signup)
- ⏳ Real job ingestion from company career pages
- ⏳ Application tracker
- ⏳ AI matching & resume tools
- ⏳ Employer posting flow

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=          # server-only, never expose
```

## License

Private / All rights reserved for now.
