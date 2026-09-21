import type { ComputedMetrics } from "@/lib/deals/types";

export const SMART_VIEWS = [
  { id: "all", label: "All Items", subtitle: "All your tracked products" },
  { id: "deals", label: "Today's Deals", subtitle: "Meaningful price changes worth a look" },
  { id: "lows", label: "Historical Lows", subtitle: "Currently at the lowest recorded price" },
  { id: "drops", label: "Biggest Drops", subtitle: "Largest meaningful percentage cuts" },
  { id: "unusual", label: "Sale, But Not Unusual", subtitle: "Advertised discounts that are historically normal" },
] as const;

export type SmartView = (typeof SMART_VIEWS)[number]["id"];

export function isSmartView(value: string | undefined): value is SmartView {
  return SMART_VIEWS.some((view) => view.id === value);
}

export function matchesView(metrics: ComputedMetrics, view: SmartView): boolean {
  switch (view) {
    case "all":
      return true;
    case "deals":
      return (
        metrics.status === "HISTORICAL_LOW" ||
        metrics.status === "NEAR_HISTORICAL_LOW" ||
        metrics.status === "SIGNIFICANT_DROP" ||
        metrics.priceChangePercent <= -10
      );
    case "lows":
      return metrics.status === "HISTORICAL_LOW";
    case "drops":
      return metrics.priceChangePercent <= -10;
    case "unusual":
      return metrics.status === "SALE_BUT_NOT_UNUSUAL";
  }
}
