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

1. **A public marketing site** — Home, About Us, Our Projects, Our Activities, Contact Us — built from the foundation's brochure content, bilingual (Bengali/English toggle).
2. **A private admin dashboard** — the original single-page donation/expense tracker — reachable only via `/salsabilownerlogin` → `/dashboard`.

Firebase (Auth + Firestore) remains the backend for the admin half, unchanged from before the migration; there is no backend for the public half beyond the Contact form and the Our Activities page's read-only fetch from Blogger's public feed (see below) — the rest is static bilingual content.

### Route map

```
/                      Home (public)
/about                 About Us — vision/mission (public)
/projects              Our Projects — Zakat / Sadaqah Jariyah / Rehabilitation, shown as a donation-focused showcase with per-category media (public)
/activities            Our Activities — posts pulled from the foundation's Blogger blog, link out to the original post (public)
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
- `lib/siteConfig.ts` — language-independent facts (phone/bKash/Nagad numbers, email, social handles, `blogUrl`) plus `projectMedia`, an array of `{ image, video }` (paths under `public/projects/`) read by index into `dictionaries.ts`'s `projects.categories` to fill each project's media panel on the Our Projects page — `null`/`null` renders a themed icon placeholder until real files are added. The brochure only gives social **handles**, not URLs — `youtube.href`/`facebook.href` are placeholders; replace them with real links before relying on them.
- `app/(public)/components/` — `Navbar` (nav links + `LanguageToggle`), `Footer`, and `HomeContent` (the group-root page's content, colocated here since it lives directly in `app/(public)/`). `Navbar`/`Footer` are shared by every page in the group via `app/(public)/layout.tsx`.
- `app/(public)/about/components/AboutContent.tsx`, `app/(public)/projects/components/ProjectsContent.tsx`, `app/(public)/activities/components/ActivitiesContent.tsx`, `app/(public)/contact/components/ContactContent.tsx` — one content component per nested route, colocated with its own `page.tsx`.
- `app/(public)/components/FadeIn.tsx` and `SectionDivider.tsx` — small presentational helpers shared across public pages: `FadeIn` is a scroll-reveal wrapper (`IntersectionObserver` + CSS transition, no animation library); `SectionDivider` is a decorative rule used between sections.

**Contact form** (`app/(public)/contact/components/ContactForm.tsx` → `app/api/contact/route.ts`): the only public-side server code that writes data. The client form `POST`s `{ name, email, phone, message }` as JSON to `/api/contact`, which sends it with `nodemailer` through Gmail (`service: "gmail"`) using an App Password — not the account's normal login password. Required server-only env vars (never `NEXT_PUBLIC_`-prefixed): `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_APP_PASSWORD`, and optionally `CONTACT_TO_EMAIL` (defaults to `CONTACT_EMAIL_USER` if unset). These also need to be added to Vercel's environment variables when deploying, same as the Firebase vars below.

**Our Activities page** (`app/(public)/activities/page.tsx` → `lib/blogger.ts`, paginated via `app/api/activities/route.ts`): the other public-side server code, read-only. `page.tsx` is an `async` Server Component that calls `getBlogPosts()`, which fetches one page (`ACTIVITIES_PAGE_SIZE` = 9 posts) of the foundation's Blogger blog (`siteConfig.blogUrl`) via its public JSON feed (`{blogUrl}feeds/posts/default?alt=json&start-index=…&max-results=…`) — no API key needed since the blog is public — with `next: { revalidate: 3600 }` so it's re-fetched at most hourly rather than on every request. It strips HTML from each entry's content for a plain-text excerpt, pulls a thumbnail (YouTube preview or the first `<img>` in the post body, upsized via its Blogger size-segment), reads the feed's `openSearch$totalResults` for the total post count, and returns `{ posts: [], total: 0 }` on any fetch/parse failure so a Blogger outage degrades to an empty-state message instead of a broken page. `ActivitiesContent` renders the first page client-side (for the language toggle) as cards linking out to the original Blogspot post in a new tab, plus a "Load More" button that fetches subsequent pages from `/api/activities?start=…&count=…` and appends them to local state — that API route exists only because Blogger's public feed doesn't send CORS headers for client-side fetches, so pagination has to go through a same-origin proxy. Thumbnails use a plain `<img>`, not `next/image`, since Blogger serves images from several unpredictable subdomains not worth allowlisting in `next.config.js`.

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
