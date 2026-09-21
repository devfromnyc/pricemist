import type { CatalogProduct } from "./demo";

export type BadgeTone = "low" | "drop" | "caution" | "accent";

export function dealBadge(product: CatalogProduct): { label: string; tone: BadgeTone } | null {
  switch (product.metrics.status) {
    case "HISTORICAL_LOW":
      return { label: "Historical Low", tone: "low" };
    case "NEAR_HISTORICAL_LOW":
      return { label: "Near Low", tone: "low" };
    case "SIGNIFICANT_DROP":
      return {
        label: `↓ ${Math.abs(Math.round(product.metrics.priceChangePercent))}%`,
        tone: "drop",
      };
    case "SALE_BUT_NOT_UNUSUAL":
      return { label: "Not unusual", tone: "caution" };
    case "TYPICAL_SALE":
      return { label: "On sale", tone: "accent" };
    case "PRICE_INCREASED":
      return { label: "Price up", tone: "drop" };
    default:
      return null;
  }
}
