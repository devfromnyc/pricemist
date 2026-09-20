# PriceMist Implementation Plan

> **For agentic workers:** Implement phase-by-phase. Do not generate the entire app in one pass. Deal math is TDD. UI follows `docs/superpowers/specs/2026-09-20-pricemist-design.md`.

**Goal:** A demoable ecommerce deal-intelligence SaaS. Seeded price history and deterministic math are the product. AI is optional.

**Architecture:** Next.js 16 App Router reads Neon Postgres via Prisma. Ingest is a CLI job (later GitHub Actions). Gemini sits behind `AiProvider` and can be off.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Prisma, PostgreSQL (Neon), Better Auth, Recharts, Gemini (optional), Vitest, Playwright (late).

## Global Constraints

- Integer cents for all money
- Deal status is first-match rules, never an LLM opinion
- Demo/seed data is the client demo; no Nike/Target/lululemon/Carter’s scrapers in MVP
- App works when `AI_ENABLED=false`
- Visual chrome matches the provided dashboard mockup (sidebar + product grid + purple accent)
- USD only; “today” is America/New_York
- Watchlist/alert tables may exist; their UI is deferred
- No Vite

## Phases

1. Foundation — Prisma schema, seed (4 stores × ~10 products × 180 days), deal metric functions + tests
2. App UI — sidebar Smart Views, product grid/cards matching the mockup
3. History engine wired into seed (same functions seed uses)
4. Product page + Keepa-style step chart
5. Dashboard Smart Views + advertised vs historical
6. Better Auth + demo account + followed stores
7. Ingest pipeline + fixture adapter (+ optional Shopify later)
8. Gemini explanations (cached)
9. Natural-language search → structured filters → SQL
10. Polish, Playwright smoke, Vercel + Neon deploy

## Visual IA (from mockup)

Smart Views: All Items, Today’s Deals, Historical Lows, Biggest Drops, Sale But Not Unusual.

Collections: followed stores.

Cards: photo, title, price, store, one pill.

## Out of scope for MVP

Live brand scrapers, alert delivery, browser extension, OAuth, Stripe, adding this app to `james-freelance` (follow-up).
