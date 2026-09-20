import { describe, expect, it } from "vitest";
import { computeMetrics } from "@/lib/deals/metrics";
import { NOW, observation, repeat, series } from "../helpers";

describe("computeMetrics", () => {
  it("throws when there are no observations", () => {
    expect(() => computeMetrics([], NOW)).toThrow(/observation/i);
  });

  it("uses the latest observation as the current price", () => {
    const metrics = computeMetrics(series([10000, 9000, 7900]), NOW);
    expect(metrics.currentPriceCents).toBe(7900);
  });

  it("uses the last different price as previous", () => {
    const metrics = computeMetrics(
      series([...repeat(9900, 20), ...repeat(7900, 3)]),
      NOW,
    );
    expect(metrics.previousPriceCents).toBe(9900);
    expect(metrics.priceChangeCents).toBe(-2000);
    expect(metrics.priceChangePercent).toBeCloseTo(-20.202, 2);
  });

  it("treats a 1-cent difference as a real previous price", () => {
    const metrics = computeMetrics(series([5000, 5001]), NOW);
    expect(metrics.previousPriceCents).toBe(5000);
    expect(metrics.priceChangeCents).toBe(1);
  });

  it("returns a null 90-day average when the window has fewer than 7 points", () => {
    const metrics = computeMetrics(series([8000, 8100, 7900]), NOW);
    expect(metrics.average90Cents).toBeNull();
    expect(metrics.percentBelow90DayAverage).toBeNull();
  });

  it("averages observations inside the 90-day window", () => {
    const prices = [...repeat(10000, 60), ...repeat(8000, 30)];
    const metrics = computeMetrics(series(prices), NOW);
    expect(metrics.average90Cents).toBe(Math.round((10000 * 60 + 8000 * 30) / 90));
  });

  it("computes historical low and high from every observation", () => {
    const metrics = computeMetrics(series([12000, 6900, 9900, 7900]), NOW);
    expect(metrics.historicalLowCents).toBe(6900);
    expect(metrics.historicalHighCents).toBe(12000);
    expect(metrics.distanceFromLowCents).toBe(1000);
  });

  it("counts whole days since the last price change", () => {
    const metrics = computeMetrics(
      series([...repeat(9900, 10), ...repeat(7900, 4)]),
      NOW,
    );
    expect(metrics.daysAtCurrentPrice).toBe(3);
  });

  it("computes advertised discount from compare-at", () => {
    const metrics = computeMetrics(series(repeat(6000, 20), 10000), NOW);
    expect(metrics.advertisedDiscountPercent).toBeCloseTo(40);
  });

  it("computes historical discount against the 90-day average", () => {
    const prices = [...repeat(10000, 80), ...repeat(6000, 10)];
    const metrics = computeMetrics(series(prices, 10000), NOW);
    expect(metrics.historicalDiscountPercent).toBeCloseTo(
      metrics.percentBelow90DayAverage ?? 0,
    );
    expect(metrics.percentBelow90DayAverage).toBeGreaterThan(30);
  });

  it("returns a low historical percentile when the current price is among the cheapest", () => {
    const metrics = computeMetrics(
      series([...repeat(10000, 40), 6900]),
      NOW,
    );
    expect(metrics.historicalPercentile).toBeLessThanOrEqual(10);
  });
});

describe("computeMetrics status", () => {
  it("marks short histories as insufficient", () => {
    const metrics = computeMetrics(series(repeat(7900, 10), 10000), NOW);
    expect(metrics.status).toBe("INSUFFICIENT_HISTORY");
  });

  it("marks a new recorded low", () => {
    const metrics = computeMetrics(
      series([...repeat(11000, 100), ...repeat(6900, 5)]),
      NOW,
    );
    expect(metrics.status).toBe("HISTORICAL_LOW");
  });

  it("marks a price within 5% of the low and well below the 90-day average", () => {
    const metrics = computeMetrics(
      series([...repeat(10000, 100), 6900, ...repeat(7200, 14)]),
      NOW,
    );
    expect(metrics.status).toBe("NEAR_HISTORICAL_LOW");
  });

  it("marks a significant drop that is not a historical low", () => {
    const metrics = computeMetrics(
      series([...repeat(6900, 20), ...repeat(9900, 80), ...repeat(7900, 2)]),
      NOW,
    );
    expect(metrics.status).toBe("SIGNIFICANT_DROP");
  });

  it("does not call a tiny drop significant even if the percent looks large on junk prices", () => {
    const metrics = computeMetrics(
      series([...repeat(2000, 30), 1700]),
      NOW,
    );
    expect(metrics.status).not.toBe("SIGNIFICANT_DROP");
  });

  it("detects an advertised sale that is not historically unusual", () => {
    const metrics = computeMetrics(series(repeat(6000, 60), 10000), NOW);
    expect(metrics.advertisedDiscountPercent).toBeCloseTo(40);
    expect(metrics.status).toBe("SALE_BUT_NOT_UNUSUAL");
  });

  it("marks a typical sale that is moderately below the recent average", () => {
    const metrics = computeMetrics(
      series([...repeat(9000, 70), ...repeat(8000, 20)], 10000),
      NOW,
    );
    expect(metrics.status).toBe("TYPICAL_SALE");
  });

  it("marks a meaningful price increase", () => {
    const metrics = computeMetrics(
      series([...repeat(5900, 40), ...repeat(8900, 3)]),
      NOW,
    );
    expect(metrics.status).toBe("PRICE_INCREASED");
  });

  it("marks a long unchanged full price as stable", () => {
    const metrics = computeMetrics(series(repeat(12900, 60)), NOW);
    expect(metrics.status).toBe("STABLE");
  });

  it("prefers historical low over a significant drop", () => {
    const metrics = computeMetrics(
      series([...repeat(12000, 80), 6900]),
      NOW,
    );
    expect(metrics.status).toBe("HISTORICAL_LOW");
  });
});

describe("edge observations", () => {
  it("ignores a same-price heartbeat when finding previous", () => {
    const observations = [
      observation(5, 7900),
      observation(2, 7900),
      observation(0, 7900),
    ];
    const metrics = computeMetrics(observations, NOW);
    expect(metrics.previousPriceCents).toBeNull();
    expect(metrics.priceChangeCents).toBe(0);
  });
});
