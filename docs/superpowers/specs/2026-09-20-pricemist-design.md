# PriceMist Design

**Date:** 2026-09-20  
**Status:** Approved to implement incrementally  
**Repo:** sibling of `james-freelance` at `C:\Users\aceja\Desktop\James-Portfolio-Projects\pricemist`

## Goal

A multi-store ecommerce deal intelligence product. Deterministic price math is the source of truth. AI is an optional enhancement. The client demo is seeded snapshot data, not live scraping.

## Visual source of truth

The provided dashboard mockup is the UI chrome to follow, even though its copy is placeholder/lorem.

What we take from it:

- Consumer tracker, not an admin dashboard
- White / near-white canvas, very airy
- Narrow left sidebar (~240px) with logo + grouped nav
- **Smart Views** as the primary navigation (counts on the right)
- **Collections** as a secondary group (followed stores / lists)
- Main pane title + one-line subtitle
- Compact toolbar: sort, layout, search
- Large product-photo cards on white, 3–4 columns
- Price is the loudest text on the card; store name is small and quiet
- Optional status pill on the image (Purchased / On sale / Historical low)
- Soft purple/indigo accent for selected nav, FAB, and interactive chips
- Top-right utility cluster (alerts, saved, avatar) — alerts can be visual-only in MVP
- Floating circular primary action, bottom-right
- Light hairline dividers, almost no box-shadow, large image whitespace

What we do **not** take from the mockup:

- Polish placeholder copy and fake SKUs
- “Purchased / Refunded / Manage collections” as core MVP IA
- Treating this as a generic wishlist CMS
- Heavy notification drawer as a v1 feature

## Information architecture (mapped to the mockup)

**Smart Views**

| Nav item | Product meaning |
|---|---|
| All Items | Every tracked/demo product |
| On Sale / Today’s Deals | Meaningful price changes today |
| Historical Lows | Current price is the recorded low |
| Biggest Drops | Largest meaningful % reductions |
| Sale, But Not Unusual | Advertised discount that is historically normal |

**Your Collections (MVP)**

Followed stores: Carter’s, lululemon, Nike, Target. Later: user watchlists.

**Product card**

Image, title, current price, optional compare-at + % change, store name, one status pill max.

**Product page (not in the mockup; required)**

Keepa-style step price-history chart, advertised vs historical discount, metric grid.

## Visual tokens

- Page: `#FFFFFF` / `#FAFAFA`
- Sidebar: white, hairline `#EEEEF2`
- Ink: `#111118`
- Muted: `#6B6B76`
- Accent: `#5B5CE2` (selected view, FAB, links)
- Drop / sale: `#E11D48`
- Historical low: accent or `#0F766E`
- “Not unusual”: `#B45309`
- Card radius: 16–20px
- Price type: tabular nums, 20–24px on cards

## Architecture (summary)

New Next.js 16 app. Neon PostgreSQL + Prisma. Better Auth. Demo seed first. Fixture store adapter. GitHub Actions for ingest later. Gemini behind `AiProvider`, optional.

Deal statuses are first-match rules over integer cents. See the implementation plan for formulas, schema, and phases.

## Constraints

- Do not scrape Nike / Target / lululemon / Carter’s in MVP
- Do not call an LLM to decide if a deal is good
- App must work with AI disabled
- Implement phase by phase, not as one dump
