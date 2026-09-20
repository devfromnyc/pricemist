import { classifyDeal } from "./classify";
import { MIN_AVERAGE_POINTS } from "./thresholds";
import type { ComputedMetrics, PriceObservation } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function windowAverage(
  observations: PriceObservation[],
  now: Date,
  days: number,
): number | null {
  const start = now.getTime() - days * MS_PER_DAY;
  const prices = observations
    .filter((observation) => observation.recordedAt.getTime() >= start)
    .map((observation) => observation.priceCents);

  if (prices.length < MIN_AVERAGE_POINTS) {
    return null;
  }

  return Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
}

function percentBelow(averageCents: number | null, currentPriceCents: number): number | null {
  if (averageCents === null || averageCents === 0) {
    return null;
  }
  return ((averageCents - currentPriceCents) / averageCents) * 100;
}

export function computeMetrics(
  observations: PriceObservation[],
  now: Date,
): ComputedMetrics {
  if (observations.length === 0) {
    throw new Error("At least one observation is required");
  }

  const sorted = [...observations].sort(
    (left, right) => left.recordedAt.getTime() - right.recordedAt.getTime(),
  );
  const current = sorted[sorted.length - 1];
  const currentPriceCents = current.priceCents;

  let firstCurrentIndex = sorted.length - 1;
  let previousPriceCents: number | null = null;
  for (let index = sorted.length - 2; index >= 0; index -= 1) {
    if (sorted[index].priceCents === currentPriceCents) {
      firstCurrentIndex = index;
      continue;
    }
    previousPriceCents = sorted[index].priceCents;
    break;
  }

  const lastPriceChangedAt =
    previousPriceCents === null ? null : sorted[firstCurrentIndex].recordedAt;
  const daysAtCurrentPrice = Math.floor(
    (now.getTime() - sorted[firstCurrentIndex].recordedAt.getTime()) / MS_PER_DAY,
  );

  const priceChangeCents =
    previousPriceCents === null ? 0 : currentPriceCents - previousPriceCents;
  const priceChangePercent =
    previousPriceCents === null || previousPriceCents === 0
      ? 0
      : (priceChangeCents / previousPriceCents) * 100;

  const prices = sorted.map((observation) => observation.priceCents);
  const historicalLowCents = Math.min(...prices);
  const historicalHighCents = Math.max(...prices);
  const average30Cents = windowAverage(sorted, now, 30);
  const average60Cents = windowAverage(sorted, now, 60);
  const average90Cents = windowAverage(sorted, now, 90);
  const percentBelow30DayAverage = percentBelow(average30Cents, currentPriceCents);
  const percentBelow90DayAverage = percentBelow(average90Cents, currentPriceCents);

  const compareAt = current.compareAtPriceCents;
  const advertisedDiscountPercent =
    compareAt !== null && compareAt > currentPriceCents
      ? ((compareAt - currentPriceCents) / compareAt) * 100
      : null;

  const cheaperOrEqualCount = prices.filter((price) => price <= currentPriceCents).length;
  const historicalPercentile = (cheaperOrEqualCount / prices.length) * 100;
  const historySpanDays = Math.floor(
    (sorted[sorted.length - 1].recordedAt.getTime() - sorted[0].recordedAt.getTime()) /
      MS_PER_DAY,
  );

  const withoutStatus = {
    currentPriceCents,
    previousPriceCents,
    priceChangeCents,
    priceChangePercent,
    average30Cents,
    average60Cents,
    average90Cents,
    historicalLowCents,
    historicalHighCents,
    distanceFromLowCents: currentPriceCents - historicalLowCents,
    percentBelow30DayAverage,
    percentBelow90DayAverage,
    advertisedDiscountPercent,
    historicalDiscountPercent: percentBelow90DayAverage,
    historicalPercentile,
    daysAtCurrentPrice,
    observationCount: sorted.length,
    historySpanDays,
    lastPriceChangedAt,
  };

  return {
    ...withoutStatus,
    status: classifyDeal(withoutStatus),
  };
}
