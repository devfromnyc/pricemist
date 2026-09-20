import { PrismaClient } from "@prisma/client";
import { computeMetrics } from "../src/lib/deals/metrics";
import { eventsForStatus } from "../src/lib/deals/events";
import { seedProducts, seedStores } from "../src/lib/seed/catalog";
import { buildScenario } from "../src/lib/seed/scenarios";

const prisma = new PrismaClient();
const SEED_NOW = new Date("2026-09-20T20:00:00.000Z");

async function main() {
  await prisma.priceAlert.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.aiCache.deleteMany();
  await prisma.priceEvent.deleteMany();
  await prisma.productMetrics.deleteMany();
  await prisma.productPrice.deleteMany();
  await prisma.userStore.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const stores = await Promise.all(
    seedStores.map((store) =>
      prisma.store.create({
        data: {
          slug: store.slug,
          name: store.name,
          domain: store.domain,
          adapterKey: store.adapterKey,
          logoUrl: `/demo/${store.slug}.svg`,
          source: "DEMO",
        },
      }),
    ),
  );
  const storeBySlug = new Map(stores.map((store) => [store.slug, store]));

  for (const item of seedProducts) {
    const store = storeBySlug.get(item.storeSlug);
    if (!store) {
      throw new Error(`Unknown store slug: ${item.storeSlug}`);
    }

    const observations = buildScenario(item.scenario, SEED_NOW);
    const latest = observations[observations.length - 1];
    const metrics = computeMetrics(observations, SEED_NOW);

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        externalId: item.externalId,
        slug: item.slug,
        title: item.title,
        brand: item.brand,
        category: item.category,
        subcategory: item.subcategory,
        url: item.url,
        imageUrl: item.imageUrl,
        currentPriceCents: latest.priceCents,
        compareAtPriceCents: latest.compareAtPriceCents,
        source: "DEMO",
        prices: {
          create: observations.map((observation) => ({
            priceCents: observation.priceCents,
            compareAtPriceCents: observation.compareAtPriceCents,
            recordedAt: observation.recordedAt,
            source: "DEMO",
          })),
        },
        metrics: {
          create: {
            previousPriceCents: metrics.previousPriceCents,
            priceChangeCents: metrics.priceChangeCents,
            priceChangePercent: metrics.priceChangePercent,
            average30Cents: metrics.average30Cents,
            average60Cents: metrics.average60Cents,
            average90Cents: metrics.average90Cents,
            historicalLowCents: metrics.historicalLowCents,
            historicalHighCents: metrics.historicalHighCents,
            distanceFromLowCents: metrics.distanceFromLowCents,
            percentBelow30DayAverage: metrics.percentBelow30DayAverage,
            percentBelow90DayAverage: metrics.percentBelow90DayAverage,
            advertisedDiscountPercent: metrics.advertisedDiscountPercent,
            historicalDiscountPercent: metrics.historicalDiscountPercent,
            historicalPercentile: metrics.historicalPercentile,
            daysAtCurrentPrice: metrics.daysAtCurrentPrice,
            observationCount: metrics.observationCount,
            historySpanDays: metrics.historySpanDays,
            status: metrics.status,
            lastPriceChangedAt: metrics.lastPriceChangedAt,
            computedAt: SEED_NOW,
          },
        },
        events: {
          create: eventsForStatus(
            metrics.status,
            latest.priceCents,
            metrics.lastPriceChangedAt ?? latest.recordedAt,
          ),
        },
      },
    });

    console.log(`seeded ${product.title} (${metrics.status})`);
  }

  console.log(`Seeded ${stores.length} stores and ${seedProducts.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
