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

## Local

```bash
npm install
cp .env.example .env
# set DATABASE_URL to a Neon or local Postgres database
npx prisma migrate dev
npm run db:seed
npm run dev
```

```bash
npm test
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

- `docs/superpowers/specs/2026-09-20-pricemist-design.md`
- `docs/superpowers/plans/2026-09-20-pricemist.md`
