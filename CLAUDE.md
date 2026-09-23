# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — run the dev server (Next.js, http://localhost:3000)
- `npm run build` — production build (type-checks + builds all routes)
- `npm start` — serve the production build (run `npm run build` first)
- `npm run lint` — `next lint` (`eslint-config-next`). **No ESLint config file is committed**, so on Next 15.5 this is deprecated and drops into an interactive setup prompt rather than linting, and `next build` skips its lint step for the same reason. Use `npx tsc --noEmit` for a quick type-check without a full build.

There is no test runner configured. The old CRA `App.test.js` (unmodified boilerplate that asserted a non-existent "learn react" link) was removed during the Next.js migration; wiring up `next/jest` + Testing Library is a separate future task if tests are wanted.

`npm run build` overwrites the `.next/` directory a running `npm run dev` server is serving from, leaving that dev server in a broken state — if the user has a dev server up, tell them to restart it after any build.

**Stale leftovers from the pre-migration CRA app — ignore them, don't edit them, and don't treat them as build output:** `build/` (the old CRA production bundle; untracked and gitignored) and `README.md` (CRA boilerplate plus a stale credentials scratchpad; **tracked in git**, not gitignored; this file, not the README, is the accurate description of the project).

## Architecture

This is a single-tenant donation/expense tracker for "As-Salsabil Foundation," now split into two halves in one Next.js (App Router) + TypeScript app:

1. **A public marketing site** — Home, About Us, Our Projects, Our Activities, Contact Us — built from the foundation's brochure content, bilingual (Bengali/English toggle).
2. **A private admin dashboard** — the original single-page donation/expense tracker, plus a Gallery manager — reachable only via `/salsabilownerlogin` → `/dashboard`.

Firebase (Auth + Firestore) remains the backend for the admin half, unchanged from before the migration. Beyond that, the public half's only backend touchpoints are: the Contact form, the Our Activities page's read-only fetch from Blogger's public feed, and the Our Projects page's Gallery (Firestore-backed, with Cloudinary for media storage and the YouTube Data API for the playlists tab) — see below for all three. Everything else on the public side is static bilingual content.

### Route map

```
/                      Home (public)
/about                 About Us — vision/mission (public)
/projects              Our Projects — alternating showcase cards, one per category, plus a Gallery (uploaded media + YouTube playlists) (public)
/projects/[slug]       One project category's detail page — static params, one per entry in dictionaries.ts's `projects.categories` (public)
/activities            Our Activities — posts pulled from the foundation's Blogger blog, link out to the original post (public)
/contact               Contact Us — office, phone/bKash/Nagad, email, socials (public)
/salsabilownerlogin    Admin login
/dashboard             Admin dashboard (auth-gated): donation/expense tracker + Gallery manager
/api/contact           POST — sends the Contact Us form via email (public, server-only)
/api/activities        GET — paginates the Our Activities Blogger feed (public, server-only proxy)
/api/youtube/playlists GET — proxies the YouTube Data API v3 for the Gallery's playlists tab (public, server-only proxy)
/api/gallery/sign      POST — admin-only, returns a signed Cloudinary upload signature
/api/gallery/delete    POST — admin-only, deletes a Cloudinary asset by publicId
```

`/salsabilownerlogin` is not linked from the public navbar/footer — reaching it requires the direct URL. That's a UX choice, not a security boundary; the real boundary is Firestore security rules (managed in the Firebase console, not versioned in this repo).

### Component colocation

Route-specific components live **inside their own route folder**, under a local `components/` subdirectory — not in a shared top-level directory — following the App Router convention that only `page.tsx`/`layout.tsx`/etc. are special; any other folder name (like `components/`) is invisible to the router and safe to nest anywhere. The only exception is `components/LoadingScreen.tsx` at the repo root, which stays there because it's genuinely shared between two sibling route folders (`app/dashboard/` and `app/salsabilownerlogin/`) that don't contain each other. When adding a component, colocate it inside the route folder that uses it; only promote it to the top-level `components/` if a second, unrelated route folder also needs it.

**Import style**: `tsconfig.json` maps `@/*` to the repo root, and cross-directory imports use it (`@/lib/firebase`, `@/types`, `@/components/LoadingScreen`). Relative paths are used only for *within-group* siblings — e.g. a nested public page reaching the group's shared helpers (`../../components/FadeIn`). Follow whichever the surrounding file already uses.

**Images**: `next.config.js`'s `images.remotePatterns` allowlists exactly one remote host, `res.cloudinary.com` — so Gallery media (and anything else Cloudinary-hosted) can use `next/image`, and any *new* remote image host must be added there first or `next/image` will throw at runtime. Blogger thumbnails deliberately sidestep this with a plain `<img>` (see Our Activities below).

### Public site (`app/(public)/`)

Each page is a **Server Component** (`page.tsx`) that exports Next's `metadata` for SEO, and renders a **Client Component** (`components/XxxContent.tsx`) that reads the active language. This split exists because Client Components can't export `metadata` — so the server file owns SEO, the client file owns the bilingual toggle.

- `lib/i18n/LanguageProvider.tsx` — a client Context (`useLanguage()`) that holds `"bn" | "en"`, persists the choice to `localStorage`, and syncs `document.documentElement.lang`. Wraps only the `(public)` route group (`app/(public)/layout.tsx`), not the admin routes.
- `lib/i18n/dictionaries.ts` — all bn/en copy for the public pages, typed against a `Dictionary` interface. Content is adapted from `As-Salsabil Foundation.pdf` (the foundation's brochure).
- `lib/siteConfig.ts` — language-independent facts (phone/bKash/Nagad numbers, email, social handles, `blogUrl`, `youtube.channelId`) plus `projectMedia`, an array of `{ image, video }` (paths under `public/projects/`) read by index into `dictionaries.ts`'s `projects.categories` to fill each project's media panel on the Our Projects page — `null`/`null` renders a themed icon placeholder until real files are added. The brochure only gives social **handles**, not URLs — `youtube.href`/`facebook.href` are placeholders; replace them with real links before relying on them.
- `app/(public)/components/` — `Navbar` (nav links + `LanguageToggle`), `Footer`, and `HomeContent` (the group-root page's content, colocated here since it lives directly in `app/(public)/`). `Navbar`/`Footer` are shared by every page in the group via `app/(public)/layout.tsx`.
- `app/(public)/about/components/AboutContent.tsx`, `app/(public)/activities/components/ActivitiesContent.tsx`, `app/(public)/contact/components/ContactContent.tsx` — one content component per nested route, colocated with its own `page.tsx`. `app/(public)/projects/components/` has more than one file — see Gallery below.
- `app/(public)/components/FadeIn.tsx` and `SectionDivider.tsx` — small presentational helpers shared across public pages: `FadeIn` is a scroll-reveal wrapper (`IntersectionObserver` + CSS transition, no animation library); `SectionDivider` is a decorative rule used between sections.

**Contact form** (`app/(public)/contact/components/ContactForm.tsx` → `app/api/contact/route.ts`): the only public-side server code that writes data (besides Gallery uploads, which come from the admin side — see below). The client form `POST`s `{ name, email, phone, message }` as JSON to `/api/contact`, which sends it with `nodemailer` through Gmail (`service: "gmail"`) using an App Password — not the account's normal login password. Required server-only env vars (never `NEXT_PUBLIC_`-prefixed): `CONTACT_EMAIL_USER`, `CONTACT_EMAIL_APP_PASSWORD`, and optionally `CONTACT_TO_EMAIL` (defaults to `CONTACT_EMAIL_USER` if unset). These also need to be added to Vercel's environment variables when deploying, same as the Firebase vars below.

**Our Activities page** (`app/(public)/activities/page.tsx` → `lib/blogger.ts`, paginated via `app/api/activities/route.ts`): read-only. `page.tsx` is an `async` Server Component that calls `getBlogPosts()`, which fetches one page (`ACTIVITIES_PAGE_SIZE` = 9 posts) of the foundation's Blogger blog (`siteConfig.blogUrl`) via its public JSON feed (`{blogUrl}feeds/posts/default?alt=json&start-index=…&max-results=…`) — no API key needed since the blog is public — with `next: { revalidate: 3600 }` so it's re-fetched at most hourly rather than on every request. It strips HTML from each entry's content for a plain-text excerpt, pulls a thumbnail (YouTube preview or the first `<img>` in the post body, upsized via its Blogger size-segment), reads the feed's `openSearch$totalResults` for the total post count, and returns `{ posts: [], total: 0 }` on any fetch/parse failure so a Blogger outage degrades to an empty-state message instead of a broken page. `ActivitiesContent` renders the first page client-side (for the language toggle) as cards linking out to the original Blogspot post in a new tab, plus a "Load More" button that fetches subsequent pages from `/api/activities?start=…&count=…` and appends them to local state — that API route exists only because Blogger's public feed doesn't send CORS headers for client-side fetches, so pagination has to go through a same-origin proxy. Thumbnails use a plain `<img>`, not `next/image`, since Blogger serves images from several unpredictable subdomains not worth allowlisting in `next.config.js`.

**Our Projects page** (`app/(public)/projects/page.tsx` → `ProjectsContent.tsx`): renders the original alternating showcase layout (large media panel + text panel, sides swapping per row) — unchanged in structure from before, just now looped over 10 categories instead of 3, each ending in a "বিস্তারিত দেখুন" (View Details) button linking to that category's own detail route, `/projects/[slug]`, instead of the old per-card donate link. `CATEGORY_ICONS` (a fixed lucide-react icon per array index) and `siteConfig.ts`'s `projectMedia` (per-index `{ image, video }`, paths under `public/projects/`; `video` wins over `image` when both are set, with the image used as the poster frame, and `null`/`null` falls back to a themed icon placeholder — most entries are still placeholders) must stay in the same order as `dictionaries.ts`'s `projects.categories` (see Types below) across all three files.

**Project detail pages** (`app/(public)/projects/[slug]/page.tsx` → `components/ProjectDetailContent.tsx`): a static route per category (`generateStaticParams()` reads `siteConfig.ts`'s `PROJECT_CATEGORY_SLUGS`, a language-independent slug list kept in sync with `projects.categories[].slug`); an unknown slug 404s via `notFound()`. Each page renders a banner, description, an objectives/beneficiaries/budget/area/duration info-card sidebar, a donate CTA, a gallery placeholder, an impact-stats placeholder, and an FAQ accordion — all sourced from that category's `ProjectCategory` dictionary entry (`dictionaries.ts`) via `projectDetail` for the static section labels. The gallery section shows that project's own media: `gallery` Firestore docs tagged with a matching optional `projectSlug` field, fetched server-side via `getGalleryItems({ projectSlug })` and rendered with the same `UploadedMediaTab` carousel as `/projects` (its "Load More" stays scoped to that slug). It falls back to the "coming soon" placeholder when a project has no tagged media. The impact-stats section uses `impactStats` from the dictionary when present, otherwise a placeholder, never made-up numbers. **The `projectSlug` query needs a Firestore composite index on `gallery` (`projectSlug` Asc, `createdAt` Desc).** Without it, `getGalleryItems` catches the error and returns an empty list, so the page silently shows the placeholder. Both `/projects` and `/projects/[slug]` set `export const revalidate = 300`, because the Firestore SDK isn't `fetch` and Next would otherwise freeze the server-fetched media at build time.

**Our Projects page's Gallery** (`lib/gallery.ts`, `app/(public)/projects/components/GallerySection.tsx`): sits below the project grid on `/projects` (not per-category — one sitewide gallery) and has two tabs, switched client-side in `GallerySection` (`activeTab` state, no route change):
  - **Uploaded Media tab** (`UploadedMediaTab.tsx`): a single-slide carousel (not a grid) over the public, admin-populated `gallery` Firestore collection — one large slide with a slow (1.2s), auto-advancing (6s interval, pauses on hover/touch/lightbox) sliding transition, plus a horizontally scrollable thumbnail strip below it (arrow buttons either side, active thumbnail highlighted, auto-scrolled into view via `scrollIntoView` as the slide changes). Clicking the current slide opens `MediaLightbox.tsx`, a fullscreen viewer with its own prev/next/Escape handling, decoupled from the carousel's own index state. `page.tsx` fetches the first page server-side via `getGalleryItems()` (`lib/gallery.ts`, `GALLERY_PAGE_SIZE` = 12, ordered by `createdAt` desc) and passes it down as `initialItems`/`initialCursor`; a "Load More" button fetches further pages client-side straight from Firestore's client SDK (no API route needed — unlike Blogger/YouTube, Firestore's client SDK has no CORS restriction and holds no secret) using `afterCreatedAt` as a serializable cursor, appending into the same carousel.
  - **YouTube Playlists tab** (`YouTubePlaylistsTab.tsx`): fetches from `/api/youtube/playlists`, which proxies `lib/youtube.ts`'s call to the YouTube Data API v3 (`GET .../playlists?channelId=…`, mirroring `lib/blogger.ts`'s shape: native `fetch`, `revalidate: 3600`, safe empty-result fallback on error) — this route exists to keep `YOUTUBE_API_KEY` off the browser, not for CORS. It paginates with YouTube's opaque `pageToken` (`PLAYLISTS_PAGE_SIZE` = 12): the tab keeps `nextPageToken` in state and its "Load More" button calls `/api/youtube/playlists?pageToken=…`, which is a different cursor style from Blogger's numeric `start` offset and the gallery's `afterCreatedAt`. `siteConfig.youtube.channelId` supplies the channel; the key must be restricted to "YouTube Data API v3" in Google Cloud Console.

  The sitewide gallery shows every item, whether or not it has a `projectSlug`.

  Admin write path for the gallery: `app/dashboard/components/GalleryScreen.tsx` (see Admin dashboard below) is the only place gallery items are created, deleted, or assigned to a project. Uploads are tagged via `AddGalleryItemModal`'s project dropdown. Existing items are re-tagged via the grid's tag button, which calls `updateDoc` and uses `deleteField()` for "General". Both read their choices from `galleryProjectOptions.ts`, which is built from the English dictionary's `projects.categories`. The public Gallery tab is read-only. The admin grid itself (`GalleryScreen.tsx`) uses small thumbnails (3–10 responsive columns) rather than a large grid, anticipating many uploads over time.

### Admin dashboard (`app/dashboard/`, `app/salsabilownerlogin/`)

Firebase Auth is client-only, so both routes are Client Components that call `onAuthStateChanged` directly and redirect with `next/navigation`'s `useRouter().replace(...)`:
- `/salsabilownerlogin` → already authenticated? redirect to `/dashboard`. Otherwise render `LoginScreen` (`app/salsabilownerlogin/components/LoginScreen.tsx`).
- `/dashboard` → not authenticated? redirect to `/salsabilownerlogin`. Otherwise render `FoundationDashboard` (`app/dashboard/components/FoundationDashboard.tsx`).

Both route folders have a `layout.tsx` that sets `robots: { index: false, follow: false }` and `export const dynamic = "force-dynamic"` — Client Component pages can't export `metadata` themselves, and `force-dynamic` stops Next from statically prerendering these auth-gated pages at build time (prerendering them requires calling Firebase's `getAuth()` during the build, which throws `auth/invalid-api-key` if env vars aren't present in that build environment). `public/robots.txt` also disallows both paths.

**`app/dashboard/components/FoundationDashboard.tsx`** is the old `App.jsx` (`FoundationApp`) body, unchanged in behavior: all state lives here (`useState`/`useEffect`, no state library), and every other dashboard component (also under `app/dashboard/components/`) is presentational, receiving data/callbacks as props. Besides the donation/expense tracker, it also renders `GalleryScreen` as a full-screen view toggled by `showGallery` state, the same pattern used by `showYearlySummary` (not a route — see below).

**Data model**: the entire foundation's donation/expense data is a single Firestore document at `foundations/as-salsabil`, shaped as:
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

The Gallery has its own, separate Firestore collection, `gallery` (one document per media item, shape in Types below) — it's read publicly (see Our Projects page's Gallery above) and written only from the dashboard's `GalleryScreen`, which uses `onSnapshot`/`addDoc`/`deleteDoc` directly (no `foundations/as-salsabil` document involved).

**Write flow**: every donation/expense mutation (`addProject`, `renameProject`, `deleteProject`, `addTransaction`, `deleteTransaction`) follows the same pattern — compute a new `projects` object locally, call `setProjects` for optimistic UI update, then `saveToFirebase(updatedProjects)`. `deleteTransaction` deep-clones via `JSON.parse(JSON.stringify(projects))` before mutating, since a shallow spread wouldn't protect the nested year/transaction objects. `renameProject` moves a project to a new object key (rejecting the rename if the new name already exists) and updates `currentProject` in the same tick as `setProjects` so no render sees `currentProject` pointing at a deleted key.

`lib/utils/projectStats.ts` holds pure, state-free helpers (`calculateTotals`, `calculateProjectTotals`, `getAvailableYears`, `getProjectYears`, `getProjectYearKeys`) that derive income/expense/balance totals from the `{ income, expenses }` shape — used by `FoundationDashboard`/`ProjectControls` instead of inlining the aggregation logic.

**Gallery write flow** (`GalleryScreen.tsx` + `AddGalleryItemModal.tsx`): uploads go straight from the browser to Cloudinary, never through this app's server, to avoid Vercel serverless body/duration limits on large videos.
  1. `AddGalleryItemModal` requests a signature from `POST /api/gallery/sign` (sending the admin's Firebase ID token as `Authorization: Bearer …`), then uploads the file directly to Cloudinary's endpoint using that signature. It supports queuing multiple files in one session and stays open across uploads — closing it after the first file's Firestore write would hide the progress of the rest of the queue.
  2. On each successful upload, the modal calls `onUploaded`, which `GalleryScreen` wires to `addDoc(collection(db, "gallery"), item)` — the client writes the Firestore doc directly, matching this app's existing convention of the client driving all Firestore writes (there's no server-side Firestore write path anywhere in the app).
  3. Deletion (`GalleryScreen`'s trash button → `DeleteConfirmationModal`) calls `POST /api/gallery/delete` (also bearer-token-authenticated) to remove the Cloudinary asset by `publicId`, then deletes the Firestore doc client-side — the API route only ever touches Cloudinary, never Firestore.
  Both `/api/gallery/*` routes are the only server code in the app holding a secret that Firestore security rules can't protect (the Cloudinary API secret), so they're gated by `lib/firebaseAdmin.ts`'s `verifyAdminRequest()`, which verifies the bearer token via the Firebase Admin SDK. The app has exactly one admin and no role system anywhere (matches `/salsabilownerlogin`'s "logged in == admin" model), so any valid token from this Firebase project is sufficient — no extra role/claim check.

**`app/dashboard/components/`** — `FoundationDashboard`, `Header`, `Footer` (the *admin* chrome, distinct from `app/(public)/components/Navbar`/`Footer`), `LoadingScreen`'s siblings `AddProjectModal`, `EditProjectModal`, `DeleteConfirmationModal`, `ProjectControls`, `SummaryCards`, `TransactionSection`/`TransactionTable`, `TransactionFormModal`, `YearlySummaryScreen`, `SyncIndicator`, `GalleryScreen`, `AddGalleryItemModal`. `TransactionSection` owns search/sort/pagination (10 items/page) over the transactions object it's handed for the current project+year+type; `DeleteConfirmationModal` is reused for per-transaction, per-project, *and* per-gallery-item deletes. `YearlySummaryScreen` is a separate full-screen view (toggled via `showYearlySummary` state inside `FoundationDashboard`, not a route) that aggregates totals across all years/projects.

**`app/salsabilownerlogin/components/LoginScreen.tsx`** — the login form; only used by that one route.

### Firebase config

`lib/firebase.ts` (client SDK) reads `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.example`) instead of a hardcoded object. `.env.local` holds the real values and is gitignored. An older, partial `.env` (also gitignored) sits beside it. Next loads both files, and `.env.local` wins on conflicts, so put new vars in `.env.local`. Same Firebase project as before the migration; this was a hygiene change only, not a backend change.

`lib/firebaseAdmin.ts` (Admin SDK, server-only) is a separate, newer piece used exclusively to verify the admin's ID token on the two Gallery API routes that touch Cloudinary (see Gallery write flow above); it reads the service account JSON from `FIREBASE_SERVICE_ACCOUNT_KEY` (one env var holding the whole downloaded JSON as a single-line string). It has no other purpose — ordinary Firestore reads/writes throughout the app are left to console-managed security rules, not the Admin SDK.

`lib/cloudinary.ts` is the other server-only module holding a secret: it calls `cloudinary.config({ secure: true })` and lets the SDK auto-parse `CLOUDINARY_URL` (the combined `cloudinary://key:secret@cloud_name` form — no manual field mapping), and exports `signUploadParams({ folder })` for `/api/gallery/sign`. Never import it from a Client Component.

**When deploying, all server-only and `NEXT_PUBLIC_FIREBASE_*` env vars need to be added to the Vercel project's environment variables**, since `.env.local` isn't committed. See `.env.example` for the full list: Firebase client config, Contact form (`CONTACT_EMAIL_*`), Cloudinary (`CLOUDINARY_URL`), YouTube (`YOUTUBE_API_KEY`), and Firebase Admin (`FIREBASE_SERVICE_ACCOUNT_KEY`).

### Types

`types/index.ts` defines the shared shapes: `Transaction`, `YearTransactions`, `ProjectData`, `Projects`, `TransactionType` (`"income" | "expenses"`), `TransactionFormData` for the donation/expense tracker; `GalleryItemType` (`"image" | "video"`), `GalleryItem` (Firestore doc shape: `url`/`publicId` from Cloudinary, optional `width`/`height`/`duration`/`caption`, plus `bytes`, `format`, `createdAt`, `createdBy`), and `GalleryItemFormData` for the Gallery.

`lib/i18n/dictionaries.ts` additionally defines `ProjectCategory` (one Our Projects card + its detail page: `slug`, `title`, `blurb`, `description`, `objectives`, `targetAudience`, `budgetItems`, `area`, `duration`, `faq`) and `ProjectFaqItem` (`question`/`answer`) — `slug` is language-independent and must match the corresponding entry in `siteConfig.ts`'s `PROJECT_CATEGORY_SLUGS`.

### Styling

Tailwind (`tailwind.config.js`, `postcss.config.js`), with responsive variants used throughout (mobile-stacked vs. desktop-grid layouts appear side by side in the same component, e.g. the totals section in `FoundationDashboard`). Global styles/Tailwind directives live in `app/globals.css`.
