# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — run the dev server (Next.js, http://localhost:3000)
- `npm run build` — production build (type-checks + lints + builds all routes)
- `npm start` — serve the production build (run `npm run build` first)
- `npm run lint` — ESLint (`eslint-config-next`)

There is no test runner configured. The old CRA `App.test.js` (unmodified boilerplate that asserted a non-existent "learn react" link) was removed during the Next.js migration; wiring up `next/jest` + Testing Library is a separate future task if tests are wanted.

## Architecture

This is a single-tenant donation/expense tracker for "As-Salsabil Foundation," now split into two halves in one Next.js (App Router) + TypeScript app:

1. **A public marketing site** — Home, About Us, Our Projects, Contact Us — built from the foundation's brochure content, bilingual (Bengali/English toggle).
2. **A private admin dashboard** — the original single-page donation/expense tracker — reachable only via `/salsabilownerlogin` → `/dashboard`.

Firebase (Auth + Firestore) remains the backend for the admin half, unchanged from before the migration; there is no backend for the public half (it's static bilingual content).

### Route map

```
/                      Home (public)
/about                 About Us — vision/mission (public)
/projects              Our Projects — Zakat / Sadaqah Jariyah / Rehabilitation programs (public)
/contact               Contact Us — office, phone/bKash/Nagad, email, socials (public)
/salsabilownerlogin    Admin login
/dashboard             Admin dashboard (auth-gated)
/api/contact           POST — sends the Contact Us form via email (public, server-only)
```

`/salsabilownerlogin` is not linked from the public navbar/footer — reaching it requires the direct URL. That's a UX choice, not a security boundary; the real boundary is Firestore security rules (managed in the Firebase console, not versioned in this repo).

### Component colocation

Route-specific components live **inside their own route folder**, under a local `components/` subdirectory — not in a shared top-level directory — following the App Router convention that only `page.tsx`/`layout.tsx`/etc. are special; any other folder name (like `components/`) is invisible to the router and safe to nest anywhere. The only exception is `components/LoadingScreen.tsx` at the repo root, which stays there because it's genuinely shared between two sibling route folders (`app/dashboard/` and `app/salsabilownerlogin/`) that don't contain each other. When adding a component, colocate it inside the route folder that uses it; only promote it to the top-level `components/` if a second, unrelated route folder also needs it.

### Public site (`app/(public)/`)

Each page is a **Server Component** (`page.tsx`) that exports Next's `metadata` for SEO, and renders a **Client Component** (`components/XxxContent.tsx`) that reads the active language. This split exists because Client Components can't export `metadata` — so the server file owns SEO, the client file owns the bilingual toggle.

- `lib/i18n/LanguageProvider.tsx` — a client Context (`useLanguage()`) that holds `"bn" | "en"`, persists the choice to `localStorage`, and syncs `document.documentElement.lang`. Wraps only the `(public)` route group (`app/(public)/layout.tsx`), not the admin routes.
- `lib/i18n/dictionaries.ts` — all bn/en copy for the four public pages, typed against a `Dictionary` interface. Content is adapted from `As-Salsabil Foundation.pdf` (the foundation's brochure).
- `lib/siteConfig.ts` — language-independent facts (phone/bKash/Nagad numbers, email, social handles). The brochure only gives social **handles**, not URLs — `youtube.href`/`facebook.href` are placeholders; replace them with real links before relying on them.
- `app/(public)/components/` — `Navbar` (nav links + `LanguageToggle`), `Footer`, and `HomeContent` (the group-root page's content, colocated here since it lives directly in `app/(public)/`). `Navbar`/`Footer` are shared by every page in the group via `app/(public)/layout.tsx`.
- `app/(public)/about/components/AboutContent.tsx`, `app/(public)/projects/components/ProjectsContent.tsx`, `app/(public)/contact/components/ContactContent.tsx` — one content component per nested route, colocated with its own `page.tsx`.
- `app/(public)/components/FadeIn.tsx` and `SectionDivider.tsx` — small presentational helpers shared across public pages: `FadeIn` is a scroll-reveal wrapper (`IntersectionObserver` + CSS transition, no animation library); `SectionDivider` is a decorative rule used between sections.

**Contact form** (`app/(public)/contact/components/ContactForm.tsx` → `app/api/contact/route.ts`): the only public-side server code. The client form `POST`s `{ name, email, phone, message }` as JSON to `/api/contact`, which sends it with `nodemailer` through Gmail (`service: "gmail"`) using an App Password — not the account's normal login password. Required server-only env vars (never `NEXT_PUBLIC_`-prefixed): `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_APP_PASSWORD`, and optionally `CONTACT_TO_EMAIL` (defaults to `CONTACT_EMAIL_USER` if unset). These also need to be added to Vercel's environment variables when deploying, same as the Firebase vars below.

### Admin dashboard (`app/dashboard/`, `app/salsabilownerlogin/`)

Firebase Auth is client-only, so both routes are Client Components that call `onAuthStateChanged` directly and redirect with `next/navigation`'s `useRouter().replace(...)`:
- `/salsabilownerlogin` → already authenticated? redirect to `/dashboard`. Otherwise render `LoginScreen` (`app/salsabilownerlogin/components/LoginScreen.tsx`).
- `/dashboard` → not authenticated? redirect to `/salsabilownerlogin`. Otherwise render `FoundationDashboard` (`app/dashboard/components/FoundationDashboard.tsx`).

Both route folders have a `layout.tsx` that sets `robots: { index: false, follow: false }` and `export const dynamic = "force-dynamic"` — Client Component pages can't export `metadata` themselves, and `force-dynamic` stops Next from statically prerendering these auth-gated pages at build time (prerendering them requires calling Firebase's `getAuth()` during the build, which throws `auth/invalid-api-key` if env vars aren't present in that build environment). `public/robots.txt` also disallows both paths.

**`app/dashboard/components/FoundationDashboard.tsx`** is the old `App.jsx` (`FoundationApp`) body, unchanged in behavior: all state lives here (`useState`/`useEffect`, no state library), and every other dashboard component (also under `app/dashboard/components/`) is presentational, receiving data/callbacks as props.

**Data model**: the entire foundation's data is a single Firestore document at `foundations/as-salsabil`, shaped as:
```
{
  projects: {
    [projectName]: {
      income:   { [year]: { [transactionId]: { id, date, donor, amount, year, createdAt } } },
      expenses: { [year]: { [transactionId]: { ... } } },
      createdAt, createdYear
    }
  },
  lastUpdated
}
```
`FoundationDashboard` subscribes to this document with `onSnapshot` (set up on mount — the parent route already gates on auth) and always writes back with a full `setDoc` (no `merge: true`) so that deletions actually persist — any write path must send the complete `projects` object, not a partial patch.

**Write flow**: every mutation (`addProject`, `renameProject`, `deleteProject`, `addTransaction`, `deleteTransaction`) follows the same pattern — compute a new `projects` object locally, call `setProjects` for optimistic UI update, then `saveToFirebase(updatedProjects)`. `deleteTransaction` deep-clones via `JSON.parse(JSON.stringify(projects))` before mutating, since a shallow spread wouldn't protect the nested year/transaction objects. `renameProject` moves a project to a new object key (rejecting the rename if the new name already exists) and updates `currentProject` in the same tick as `setProjects` so no render sees `currentProject` pointing at a deleted key.

**Derived stats**: `lib/utils/projectStats.ts` holds pure, typed functions (`getProjectYears`, `calculateTotals`, `calculateProjectTotals`, `getAvailableYears`) that compute totals/years from the raw `projects` shape. `FoundationDashboard` wraps them in `useMemo` so they only recompute when `projects`/`currentProject`/`selectedYear` actually change.

**`app/dashboard/components/`** — `FoundationDashboard`, `Header`, `Footer` (the *admin* chrome, distinct from `app/(public)/components/Navbar`/`Footer`), `LoadingScreen`'s siblings `AddProjectModal`, `EditProjectModal`, `DeleteConfirmationModal`, `ProjectControls`, `SummaryCards`, `TransactionSection`/`TransactionTable`, `TransactionFormModal`, `YearlySummaryScreen`, `SyncIndicator`. `TransactionSection` owns search/sort/pagination (10 items/page) over the transactions object it's handed for the current project+year+type; `DeleteConfirmationModal` is reused for both per-transaction and per-project deletes. `YearlySummaryScreen` is a separate full-screen view (toggled via `showYearlySummary` state inside `FoundationDashboard`, not a route) that aggregates totals across all years/projects.

**`app/salsabilownerlogin/components/LoginScreen.tsx`** — the login form; only used by that one route.

### Firebase config

`lib/firebase.ts` reads `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.example`) instead of a hardcoded object — `.env.local` holds the real values and is gitignored. Same Firebase project as before the migration; this was a hygiene change only, not a backend change. **When deploying, the same `NEXT_PUBLIC_FIREBASE_*` vars need to be added to the Vercel project's environment variables**, since `.env.local` isn't committed.

### Types

`types/index.ts` defines the shared shapes: `Transaction`, `YearTransactions`, `ProjectData`, `Projects`, `TransactionType` (`"income" | "expenses"`), `TransactionFormData`.

### Styling

Tailwind (`tailwind.config.js`, `postcss.config.js`), with responsive variants used throughout (mobile-stacked vs. desktop-grid layouts appear side by side in the same component, e.g. the totals section in `FoundationDashboard`). Global styles/Tailwind directives live in `app/globals.css`.
