export const NOW = new Date("2026-09-20T20:00:00.000Z");

export function observation(
  daysAgo: number,
  priceCents: number,
  compareAtPriceCents: number | null = null,
  now: Date = NOW,
) {
  return {
    priceCents,
    compareAtPriceCents,
    recordedAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
  };
}

/** `prices[0]` is oldest; last value is the current price (daysAgo 0). */
export function series(
  prices: number[],
  compareAtPriceCents: number | null = null,
  now: Date = NOW,
) {
  return prices.map((priceCents, index) =>
    observation(prices.length - 1 - index, priceCents, compareAtPriceCents, now),
  );
}

export function repeat(priceCents: number, days: number): number[] {
  return Array.from({ length: days }, () => priceCents);
}
