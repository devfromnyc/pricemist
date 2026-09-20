export type DealStatus =
  | "HISTORICAL_LOW"
  | "NEAR_HISTORICAL_LOW"
  | "SIGNIFICANT_DROP"
  | "TYPICAL_SALE"
  | "SALE_BUT_NOT_UNUSUAL"
  | "PRICE_INCREASED"
  | "STABLE"
  | "INSUFFICIENT_HISTORY";

export type PriceObservation = {
  priceCents: number;
  compareAtPriceCents: number | null;
  recordedAt: Date;
};

export type ComputedMetrics = {
  currentPriceCents: number;
  previousPriceCents: number | null;
  priceChangeCents: number;
  priceChangePercent: number;
  average30Cents: number | null;
  average60Cents: number | null;
  average90Cents: number | null;
  historicalLowCents: number;
  historicalHighCents: number;
  distanceFromLowCents: number;
  percentBelow30DayAverage: number | null;
  percentBelow90DayAverage: number | null;
  advertisedDiscountPercent: number | null;
  historicalDiscountPercent: number | null;
  historicalPercentile: number;
  daysAtCurrentPrice: number;
  observationCount: number;
  historySpanDays: number;
  lastPriceChangedAt: Date | null;
  status: DealStatus;
};
