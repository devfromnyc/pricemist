import { describe, expect, it } from "vitest";
import { matchesView } from "@/lib/catalog/views";
import type { ComputedMetrics } from "@/lib/deals/types";

function metrics(overrides: Partial<ComputedMetrics>): ComputedMetrics {
  return {
    currentPriceCents: 7900,
    previousPriceCents: 9900,
    priceChangeCents: -2000,
    priceChangePercent: -20,
    average30Cents: 9000,
    average60Cents: 9000,
    average90Cents: 9000,
    historicalLowCents: 6900,
    historicalHighCents: 12000,
    distanceFromLowCents: 1000,
    percentBelow30DayAverage: 12,
    percentBelow90DayAverage: 12,
    advertisedDiscountPercent: 20,
    historicalDiscountPercent: 12,
    historicalPercentile: 20,
    daysAtCurrentPrice: 1,
    observationCount: 90,
    historySpanDays: 90,
    lastPriceChangedAt: new Date("2026-09-20T20:00:00.000Z"),
    status: "STABLE",
    ...overrides,
  };
}

describe("matchesView", () => {
  it("includes every product in all items", () => {
    expect(matchesView(metrics({ status: "STABLE" }), "all")).toBe(true);
  });

  it("includes historical lows, near lows, and significant drops in today's deals", () => {
    expect(matchesView(metrics({ status: "HISTORICAL_LOW" }), "deals")).toBe(true);
    expect(matchesView(metrics({ status: "SIGNIFICANT_DROP" }), "deals")).toBe(true);
    expect(matchesView(metrics({ status: "STABLE", priceChangePercent: 0 }), "deals")).toBe(
      false,
    );
  });

  it("includes only current historical lows in the lows view", () => {
    expect(matchesView(metrics({ status: "HISTORICAL_LOW" }), "lows")).toBe(true);
    expect(matchesView(metrics({ status: "NEAR_HISTORICAL_LOW" }), "lows")).toBe(false);
  });

  it("includes meaningful percentage drops in the drops view", () => {
    expect(matchesView(metrics({ priceChangePercent: -18 }), "drops")).toBe(true);
    expect(matchesView(metrics({ priceChangePercent: -4 }), "drops")).toBe(false);
  });

  it("includes only sale-but-not-unusual in that view", () => {
    expect(matchesView(metrics({ status: "SALE_BUT_NOT_UNUSUAL" }), "unusual")).toBe(true);
    expect(matchesView(metrics({ status: "TYPICAL_SALE" }), "unusual")).toBe(false);
  });
});
