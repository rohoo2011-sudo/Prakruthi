# Prakruthi Bull Driven Oil

React + Vite frontend with Supabase (auth, Postgres, storage).

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) and copy **Project URL** and **anon key** (Project Settings → API).
2. Add to `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`).
3. Run the SQL in `supabase/migrations/001_schema.sql` in the Supabase SQL Editor (creates tables, RLS, store seed, profiles trigger).
4. In Supabase Dashboard → Storage, create a **public** bucket named `product-images` (public read; allow authenticated uploads if you use RLS on storage).
5. First admin: sign up via the app at `/admin/login`, then in Supabase Table Editor → `profiles` set `role = 'admin'` for that user’s row.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
