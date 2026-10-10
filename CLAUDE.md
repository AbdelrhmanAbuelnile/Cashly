# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cashly is a personal expense/savings tracker frontend (React + TypeScript + Vite), built as a PWA. This repo is frontend-only; it talks to a separate backend API over HTTP (base URL configured via env vars).

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build (`vite build`)
- `npm run lint` — run ESLint over the project
- `npm run preview` — preview a production build locally

There is no test suite/framework configured in this repo currently.

## Environment configuration

Copy `.env.example` to `.env` and set:
- `VITE_MODE` — `dev` or `prod`; selects which base URL below is used
- `VITE_BASEURL_DEV` / `VITE_BASEURL` — backend API base URL for dev/prod
- `VITE_APP_PUBLIC_POSTHOG_KEY` / `VITE_APP_PUBLIC_POSTHOG_HOST` — PostHog analytics

Both `src/api/axios.ts` and `src/hooks/useAuth.tsx` independently read `VITE_MODE`/`VITE_BASEURL*` to resolve the API base URL — keep them in sync if this logic changes.

## Architecture

**Routing** (`src/App.tsx`): top-level `Routes` split into public routes (`/`, `/signin`, `/signup`, `/terms`) and a nested `/dashboard` layout route (`DashboardPage`) containing goals, transactions, settings, etc. as child routes. `App` redirects authenticated users away from non-dashboard paths to `/dashboard/transactions`.

**Auth** (`src/hooks/useAuth.tsx`): a React Context (`AuthProvider`/`useAuth`) that is the single source of truth for `user`/`isAuthenticated`, persisted to `localStorage` (`auth_user`, `auth_status`) and mirrored to the server via cookie-based sessions (`withCredentials: true`). It also handles the Google OAuth callback (reads a `user` query param), auto-refreshes the token every 45 minutes, and identifies the user to PostHog. Note this file calls `axios` directly (not the shared `axiosInstance`) and duplicates the base-URL resolution logic from `src/api/axios.ts`.

**API layer** (`src/api/*.ts`): one module per backend resource (`Auth.ts`, `Goals.ts`, `Transactions.ts`, `User.ts`), each exporting a plain object of methods that call `axiosInstance` (from `src/api/axios.ts`) against REST endpoints (e.g. `/saving-goal`, `/saving-goal/:id`). `axiosInstance` is a shared Axios client with `withCredentials: true` and a response interceptor stubbed for 401/403 handling.

**Data fetching**: TanStack React Query (`QueryClientProvider` in `main.tsx`) is used for server state in dashboard pages, built on top of the `src/api` modules above.

**UI components**: `src/components/ui/*` are shadcn/ui primitives (Radix UI underneath, see `components.json` for the shadcn config — path aliases `@/components`, `@/lib`, `@/hooks`, `@/components/ui` resolve to `src/*` via the `@` alias set in `vite.config.ts`/`tsconfig`). Styling is Tailwind CSS (`tailwind.config.js`, `src/index.css`) with `class-variance-authority`/`tailwind-merge`/`clsx` for variant composition and `tailwindcss-animate` for transitions.

**Pages structure**: `src/pages/home` (landing page), `src/pages/auth` (login/signup), `src/pages/dashboard` (authenticated app shell `DashboardPage.tsx` + `Sidebar`, with feature pages under `dashboard/pages/*` and feature-specific dialogs under `dashboard/components/*`, e.g. goal/transaction create/edit/delete dialogs).

**Provider nesting** (`src/main.tsx`): `PostHogProvider` > `Router` > `QueryClientProvider` > `AuthProvider` > `SnackbarProvider` > `App`. Order matters — `AuthProvider` needs `Router` (uses `useNavigate`), and `SnackbarProvider` (`src/hooks/useSnackbar.tsx`) provides app-wide toast/snackbar notifications via context.

**PWA**: configured via `vite-plugin-pwa` in `vite.config.ts` — manifest, icons, and app shortcuts (quick links into `/dashboard/transactions` and `/dashboard/goals`) are defined there, not in `public/manifest.json`.

**Analytics**: both PostHog (`posthog-js`, see `main.tsx`/`useAuth.tsx`) and Google Analytics (`react-ga4`, initialized in `App.tsx` with a hardcoded tracking ID) are wired up simultaneously.
