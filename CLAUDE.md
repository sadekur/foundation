# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (Create React App / react-scripts, http://localhost:3000)
- `npm run build` — production build to `build/`
- `npm test` — run tests in watch mode (Jest via react-scripts). For a single run: `CI=true npm test`. For a single file: `npm test -- App.test.js`

There is no lint script; ESLint runs via `react-app`/`react-app/jest` config embedded in `package.json` as part of `react-scripts` (build/start/test all lint automatically).

## Architecture

This is a single-tenant donation/expense tracker for "As-Salsabil Foundation," built with Create React App + Tailwind CSS, using Firebase (Auth + Firestore) for backend and realtime sync.

**All application state lives in one component**, `src/App.jsx` (`FoundationApp`). There is no state management library, router, or context — state is plain `useState`/`useEffect`, and every other component is presentational, receiving data and callbacks as props from `App.jsx`.

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
`App.jsx` subscribes to this document with `onSnapshot` (realtime listener set up once auth resolves) and always writes back with a full `setDoc` (no `merge: true`) so that deletions actually persist — any write path must send the complete `projects` object, not a partial patch.

**Write flow**: every mutation (`addProject`, `addTransaction`, `deleteTransaction`) follows the same pattern — compute a new `projects` object locally, call `setProjects` for optimistic UI update, then `saveToFirebase(updatedProjects)`. `deleteTransaction` deep-clones via `JSON.parse(JSON.stringify(projects))` before mutating, since a shallow spread wouldn't protect the nested year/transaction objects.

**Auth**: Firebase Authentication gates the whole app — `LoginScreen` renders when there's no user, `LoadingScreen` while auth state is resolving. `src/firebase.js` exports `auth` and `db` (Firestore) from a single initialized Firebase app; config (including API key) is committed inline in that file, not via env vars.

**Component structure** (`src/components/`):
- `common/` — generic UI chrome (Header, Footer, LoadingScreen, AddProjectModal, DeleteConfirmationModal)
- Feature components at the top level (`ProjectControls`, `SummaryCards`, `TransactionSection`/`TransactionTable`, `TransactionFormModal`, `YearlySummaryScreen`, `SyncIndicator`, `LoginScreen`) — these implement search, sort, and pagination locally over the props they're given, not over a global store.

`YearlySummaryScreen` is a separate full-screen view (toggled via `showYearlySummary` state in `App.jsx`, not a route) that aggregates totals across all years/projects.

Styling is Tailwind (see `tailwind.config.js`, `postcss.config.js`), with responsive variants used throughout (mobile-stacked vs. desktop-grid layouts appear side by side in the same component, e.g. the totals section in `App.jsx`).
