# PriceMist

Ecommerce deal intelligence. PriceMist tracks products across stores and tells you whether an advertised sale is actually a good deal — using historical prices and math, not an LLM opinion.

The first client-ready experience is **seeded snapshot data**.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL (Neon) + Prisma
- Vitest for deal-math tests

## Status

Phase 1: foundation, Prisma schema, seed catalog, and deterministic deal engine.

## What you need to do locally

The app and GitHub repo are ready. You still need a Postgres database and a local `.env` before seed data will load.

1. Install **Node.js 20+** if this machine does not have it.
2. In this folder, run `npm install`.
3. Create a free [Neon](https://neon.tech) account and a new project named `pricemist`.
4. In Neon, copy the **direct** connection string (not the pooled `-pooler` URL). Prisma migrations need a direct connection.
5. Copy `.env.example` to `.env` and paste that string as `DATABASE_URL`. Leave the other variables as they are for now. Auth and Gemini are not required for Phase 1.
6. Apply the schema and load demo products:

```bash
npx prisma migrate deploy
npm run db:seed
```

7. Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

`npm test` does not need a database. The homepage will run without one; the dashboard and seed will not.

Auth, Gemini, Vercel, and a custom domain are later phases. You do not need to set those up yet.

## Docs

- `docs/superpowers/specs/2026-09-20-pricemist-design.md`
- `docs/superpowers/plans/2026-09-20-pricemist.md`
