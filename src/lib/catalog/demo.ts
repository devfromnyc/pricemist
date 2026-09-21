import { computeMetrics } from "@/lib/deals/metrics";
import type { ComputedMetrics } from "@/lib/deals/types";
import { seedProducts, seedStores } from "@/lib/seed/catalog";
import { buildScenario } from "@/lib/seed/scenarios";
import { isSmartView, matchesView, type SmartView } from "./views";

export const DEMO_NOW = new Date("2026-09-20T20:00:00.000Z");

export type CatalogProduct = {
  slug: string;
  storeSlug: string;
  storeName: string;
  title: string;
  brand: string;
  imageUrl: string;
  url: string;
  currentPriceCents: number;
  compareAtPriceCents: number | null;
  metrics: ComputedMetrics;
};

export function getDemoProducts(now: Date = DEMO_NOW): CatalogProduct[] {
  return seedProducts.map((item) => {
    const store = seedStores.find((candidate) => candidate.slug === item.storeSlug);
    if (!store) {
      throw new Error(`Unknown store slug: ${item.storeSlug}`);
    }

    const observations = buildScenario(item.scenario, now);
    const latest = observations[observations.length - 1];

    return {
      slug: item.slug,
      storeSlug: store.slug,
      storeName: store.name,
      title: item.title,
      brand: item.brand,
      imageUrl: item.imageUrl,
      url: item.url,
      currentPriceCents: latest.priceCents,
      compareAtPriceCents: latest.compareAtPriceCents,
      metrics: computeMetrics(observations, now),
    };
  });
}

export function getDemoProduct(slug: string, now: Date = DEMO_NOW): CatalogProduct | null {
  return getDemoProducts(now).find((product) => product.slug === slug) ?? null;
}

export function queryCatalog(options: {
  view?: string;
  store?: string;
  q?: string;
}): { view: SmartView; products: CatalogProduct[]; all: CatalogProduct[] } {
  const view = isSmartView(options.view) ? options.view : "all";
  const all = getDemoProducts();
  const query = options.q?.trim().toLowerCase() ?? "";

  const products = all.filter((product) => {
    if (!matchesView(product.metrics, view)) {
      return false;
    }
    if (options.store && product.storeSlug !== options.store) {
      return false;
    }
    if (
      query &&
      !`${product.title} ${product.brand} ${product.storeName}`.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  const sorted =
    view === "drops"
      ? [...products].sort((left, right) => left.metrics.priceChangePercent - right.metrics.priceChangePercent)
      : products;

  return { view, products: sorted, all };
}
