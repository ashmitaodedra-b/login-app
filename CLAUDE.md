# Project Instructions

## Overview

Build a production-ready Next.js application with Supabase integration, clean responsive UI, seed data, and Vercel deployment support.

Before building anything non-trivial, ask for any missing details (feature scope, data model, auth requirements, etc.).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (latest) with App Router |
| Styling | Tailwind CSS |
| Backend/Auth | Supabase (auth + database) |
| Deployment | Vercel |
| Language | TypeScript (strict mode) |

---

## Project Structure

```
app/                    # App Router pages and layouts
  (auth)/               # Auth-related routes (login, signup, reset)
  (dashboard)/          # Protected routes
  api/                  # API route handlers
components/
  ui/                   # Reusable primitive components
  layout/               # Header, sidebar, footer
  features/             # Feature-specific components
lib/
  supabase/
    client.ts           # Browser client
    server.ts           # Server client (cookies)
    middleware.ts        # Auth middleware helper
  utils.ts              # Shared utilities
types/
  database.types.ts     # Generated Supabase types
supabase/
  migrations/           # SQL migration files
  seed.sql              # Seed/demo data
middleware.ts           # Next.js middleware for auth protection
```

---

## Architecture Rules

### Next.js App Router
- Use Server Components by default; add `"use client"` only when needed (interactivity, browser APIs, hooks)
- Fetch data in Server Components — never in Client Components unless it is a user-triggered action
- Use `loading.tsx` and `error.tsx` for every route segment that fetches data
- Colocate route-specific components inside the route folder; share only what is truly reusable

### Supabase Integration
- Use `@supabase/ssr` for all auth and data access
  - `createBrowserClient` in Client Components
  - `createServerClient` in Server Components, Route Handlers, and Server Actions
- Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Never expose the `service_role` key client-side
- Generate and commit TypeScript types: `supabase gen types typescript --local > types/database.types.ts`
- Row Level Security (RLS) must be enabled on every table — no exceptions

### Auth
- Implement email/password login and signup as the baseline
- Handle the Supabase auth callback route at `app/auth/callback/route.ts`
- Protect routes in `middleware.ts` — redirect unauthenticated users to `/login`
- Store session via cookies (handled by `@supabase/ssr`) — never localStorage

### Seed / Demo Data
- Provide a `supabase/seed.sql` file that populates all tables with realistic demo data
- Seed data must respect RLS — use `auth.uid()` references or service role in migrations only
- The app must look fully populated on first visit with zero manual setup

---

## Code Style

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Functional components only; no class components
- Named exports for components; default exports only for Next.js pages/layouts
- Prefer `async/await` over `.then()` chains
- Handle all errors explicitly — no silent catches
- Keep components under ~150 lines; extract logic into hooks or server actions when larger

---

## UI / Design

- Tailwind CSS only — no inline styles, no CSS Modules unless absolutely necessary
- Desktop-first responsive design — style for large screens by default, then use `lg:` → `md:` → `sm:` breakpoints to scale down
- Use a consistent design token set (colors, spacing, radii) defined in `tailwind.config.ts`
- Accessible markup: semantic HTML, ARIA labels where needed, keyboard navigable
- Loading states for every async operation (skeleton loaders preferred over spinners)
- Empty states for every list or data view

---

## Performance

- Images: always use `next/image` with explicit `width`/`height` or `fill`
- Links: always use `next/link`
- Fonts: always use `next/font`
- Avoid `use client` at the layout level — it forces the entire subtree to be a client bundle
- Prefer server actions over API routes for form mutations

---

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional (never commit):
```
SUPABASE_SERVICE_ROLE_KEY=   # migrations/seed scripts only
```

Provide a `.env.example` with all keys listed but no values.

---

## Vercel Deployment

- All env vars must be set in the Vercel project dashboard
- Use `vercel.json` only if custom headers/rewrites are needed
- `next.config.ts` must have no hard-coded secrets
- Supabase project must be on a plan that allows the expected connection count (check pooler settings)
- Run `next build` locally before pushing to confirm zero build errors

---

## Database Conventions

- Table names: `snake_case`, plural (e.g., `user_profiles`, `blog_posts`)
- Primary keys: `id uuid default gen_random_uuid()`
- Timestamps: `created_at timestamptz default now()`, `updated_at timestamptz default now()`
- Add a trigger for `updated_at` on every table
- Foreign keys: always define with explicit `references` and `on delete` behavior
- Write all schema changes as numbered migration files in `supabase/migrations/`

---

## Git Conventions

- Branch: `main` (production) — never commit directly
- Feature branches: `feat/<short-name>`
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Never commit `.env.local`, `node_modules`, or `.next`

---

## Do / Don't

| Do | Don't |
|---|---|
| Ask before making large architectural decisions | Assume requirements not stated |
| Keep components small and focused | Build monolithic page components |
| Enable RLS on every table | Skip RLS "for now" |
| Use server actions for mutations | Create unnecessary API routes |
| Generate Supabase types | Use `any` for DB responses |
| Add seed data for every feature | Leave tables empty |
| Handle loading + error states | Leave async UI stateless |
