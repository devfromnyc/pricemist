import type { ComputedMetrics, DealStatus } from "./types";
import {
  MIN_HISTORY_DAYS,
  MIN_HISTORY_POINTS,
  NEAR_LOW_PERCENT,
  NEW_LOW_MAX_DAYS,
  PRICE_INCREASE_MIN_CENTS,
  PRICE_INCREASE_PERCENT,
  SALE_NOT_UNUSUAL_AD_PERCENT,
  SALE_NOT_UNUSUAL_VS_AVG,
  SIGNIFICANT_DROP_MIN_CENTS,
  SIGNIFICANT_DROP_PERCENT,
  TYPICAL_SALE_AD_PERCENT,
  TYPICAL_SALE_BELOW_AVG_MAX,
  TYPICAL_SALE_BELOW_AVG_MIN,
} from "./thresholds";

type Classifiable = Omit<ComputedMetrics, "status">;

export function classifyDeal(metrics: Classifiable): DealStatus {
  if (
    metrics.observationCount < MIN_HISTORY_POINTS ||
    metrics.historySpanDays < MIN_HISTORY_DAYS
  ) {
    return "INSUFFICIENT_HISTORY";
  }

  const hadHigherPrice =
    metrics.historicalHighCents > metrics.currentPriceCents;
  const atHistoricalLow =
    metrics.currentPriceCents <= metrics.historicalLowCents;

  if (
    atHistoricalLow &&
    hadHigherPrice &&
    metrics.daysAtCurrentPrice <= NEW_LOW_MAX_DAYS
  ) {
    return "HISTORICAL_LOW";
  }

  const distanceFromLowPercent =
    metrics.historicalLowCents === 0
      ? 0
      : (metrics.currentPriceCents - metrics.historicalLowCents) /
        metrics.historicalLowCents *
        100;

  if (
    !atHistoricalLow &&
    distanceFromLowPercent <= NEAR_LOW_PERCENT &&
    metrics.average90Cents !== null &&
    metrics.currentPriceCents <= metrics.average90Cents * 0.95
  ) {
    return "NEAR_HISTORICAL_LOW";
  }

  if (
    metrics.previousPriceCents !== null &&
    metrics.currentPriceCents < metrics.previousPriceCents &&
    metrics.priceChangePercent <= -SIGNIFICANT_DROP_PERCENT &&
    metrics.previousPriceCents - metrics.currentPriceCents >=
      SIGNIFICANT_DROP_MIN_CENTS
  ) {
    return "SIGNIFICANT_DROP";
  }

  const advertised = metrics.advertisedDiscountPercent;
  const vsAvg90 =
    metrics.average90Cents === null
      ? null
      : Math.abs(metrics.currentPriceCents - metrics.average90Cents) /
        metrics.average90Cents *
        100;

  if (
    advertised !== null &&
    advertised >= SALE_NOT_UNUSUAL_AD_PERCENT &&
    vsAvg90 !== null &&
    vsAvg90 <= SALE_NOT_UNUSUAL_VS_AVG
  ) {
    return "SALE_BUT_NOT_UNUSUAL";
  }

  if (
    advertised !== null &&
    advertised >= TYPICAL_SALE_AD_PERCENT &&
    metrics.percentBelow90DayAverage !== null &&
    metrics.percentBelow90DayAverage > TYPICAL_SALE_BELOW_AVG_MIN &&
    metrics.percentBelow90DayAverage < TYPICAL_SALE_BELOW_AVG_MAX
  ) {
    return "TYPICAL_SALE";
  }

  if (
    metrics.previousPriceCents !== null &&
    metrics.currentPriceCents - metrics.previousPriceCents >=
      PRICE_INCREASE_MIN_CENTS &&
    metrics.priceChangePercent >= PRICE_INCREASE_PERCENT
  ) {
    return "PRICE_INCREASED";
  }

  return "STABLE";
}
