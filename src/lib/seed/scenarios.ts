import type { PriceObservation } from "@/lib/deals/types";

export type ScenarioKind =
  | "historicalLow"
  | "saleButNotUnusual"
  | "significantDrop"
  | "nearHistoricalLow"
  | "shortHistory"
  | "priceIncreased"
  | "yoYo"
  | "stable"
  | "typicalSale";

function point(
  daysAgo: number,
  priceCents: number,
  compareAtPriceCents: number | null,
  now: Date,
): PriceObservation {
  return {
    priceCents,
    compareAtPriceCents,
    recordedAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
  };
}

function fromDailyPrices(
  prices: number[],
  compareAtPriceCents: number | null,
  now: Date,
): PriceObservation[] {
  return prices.map((priceCents, index) =>
    point(prices.length - 1 - index, priceCents, compareAtPriceCents, now),
  );
}

function fill(priceCents: number, days: number): number[] {
  return Array.from({ length: days }, () => priceCents);
}

export function buildScenario(kind: ScenarioKind, now: Date): PriceObservation[] {
  switch (kind) {
    case "historicalLow":
      return fromDailyPrices([...fill(11000, 175), ...fill(6900, 5)], 12900, now);
    case "saleButNotUnusual":
      return fromDailyPrices(fill(6000, 180), 10000, now);
    case "significantDrop":
      return fromDailyPrices(
        [...fill(6900, 20), ...fill(9900, 158), ...fill(7900, 2)],
        9900,
        now,
      );
    case "nearHistoricalLow":
      return fromDailyPrices(
        [...fill(10000, 165), 6900, ...fill(7200, 14)],
        10000,
        now,
      );
    case "shortHistory":
      return fromDailyPrices(fill(7900, 10), 10000, now);
    case "priceIncreased":
      return fromDailyPrices([...fill(5900, 160), ...fill(8900, 20)], 8900, now);
    case "yoYo":
      return fromDailyPrices(
        Array.from({ length: 180 }, (_, index) =>
          Math.floor(index / 14) % 2 === 0 ? 9900 : 7900,
        ),
        9900,
        now,
      );
    case "stable":
      return fromDailyPrices(fill(12900, 180), null, now);
    case "typicalSale":
      return fromDailyPrices([...fill(9000, 160), ...fill(8000, 20)], 10000, now);
  }
}
