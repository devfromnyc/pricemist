import type { DealStatus } from "./types";

export type SeedPriceEventType =
  | "PRICE_DROP"
  | "PRICE_INCREASE"
  | "HISTORICAL_LOW"
  | "PROMOTION_STARTED";

export function eventsForStatus(
  status: DealStatus,
  priceCents: number,
  occurredAt: Date,
): { type: SeedPriceEventType; priceCents: number; occurredAt: Date }[] {
  if (status === "HISTORICAL_LOW") {
    return [
      { type: "PRICE_DROP", priceCents, occurredAt },
      { type: "HISTORICAL_LOW", priceCents, occurredAt },
    ];
  }
  if (status === "SIGNIFICANT_DROP" || status === "NEAR_HISTORICAL_LOW") {
    return [{ type: "PRICE_DROP", priceCents, occurredAt }];
  }
  if (status === "PRICE_INCREASED") {
    return [{ type: "PRICE_INCREASE", priceCents, occurredAt }];
  }
  if (status === "SALE_BUT_NOT_UNUSUAL" || status === "TYPICAL_SALE") {
    return [{ type: "PROMOTION_STARTED", priceCents, occurredAt }];
  }
  return [];
}
