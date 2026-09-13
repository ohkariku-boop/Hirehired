# Hirehired

Jobs that never make it to LinkedIn.

Direct from company career pages. Less noise. Higher signal.

## Live preview (GitHub Pages)

Once Pages is enabled, the site will be at:

`https://ohkariku-boop.github.io/Hirehired/`

## Local development

```bash
npm install
npm run dev
```

## Stack

- Next.js 15 (static export for GitHub Pages)
- Tailwind CSS
- Supabase (auth + data — full features on Vercel/server deploy)

## Design

Dark, high-contrast, restrained. Accent: sharp lime. Built to feel intentional, not generic.

## Full app features

Auth, application tracking, and live job ingestion work when deployed with Supabase env vars on a Node host (Vercel recommended). The GitHub Pages build is a polished static marketing + jobs preview.
