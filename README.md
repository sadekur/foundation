# As-Salsabil Foundation

https://salsabil-foundation.vercel.app

Single-tenant donation/expense tracker for **As-Salsabil Foundation**, built as one Next.js (App Router) + TypeScript app with two halves:

1. **Public marketing site** — Home, About Us, Our Projects (with Gallery), Our Activities (Blogger feed), Contact Us — bilingual (Bengali/English).
2. **Private admin dashboard** — donation/expense tracker + Gallery manager, reachable via `/salsabilownerlogin` → `/dashboard`.

Backend: Firebase (Auth + Firestore), Cloudinary (Gallery media), Blogger public feed (Activities), YouTube Data API (Gallery playlists), Gmail via nodemailer (Contact form).

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the real values
npm run dev                  # http://localhost:3000
```

## Available Scripts

- `npm run dev` — dev server (Next.js)
- `npm run build` — production build (type-checks + builds all routes)
- `npm start` — serve the production build (run `npm run build` first)
- `npm run lint` — `next lint` (no ESLint config file is committed, so prefer `npx tsc --noEmit` for a quick type-check)

## Environment Variables

All required variables are listed in `.env.example`:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_APP_PASSWORD`, `CONTACT_TO_EMAIL` — Contact form email (Gmail App Password)
- `CLOUDINARY_URL` — Cloudinary (combined `cloudinary://key:secret@cloud_name` form)
- `YOUTUBE_API_KEY` — YouTube Data API v3 (Gallery playlists tab)
- `FIREBASE_SERVICE_ACCOUNT_KEY` — Firebase Admin service account JSON (single-line string, Gallery API auth)

Add the same variables to Vercel when deploying (`.env.local` is not committed).

## Deploy

https://vercel.com/sadekurs-projects/salsabil-foundation/settings/git
