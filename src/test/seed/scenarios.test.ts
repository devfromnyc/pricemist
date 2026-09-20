import { describe, expect, it } from "vitest";
import { computeMetrics } from "@/lib/deals/metrics";
import { buildScenario } from "@/lib/seed/scenarios";
import { NOW } from "../helpers";

describe("buildScenario", () => {
  it("builds 180 daily points for a historical low", () => {
    const observations = buildScenario("historicalLow", NOW);
    expect(observations).toHaveLength(180);
    expect(computeMetrics(observations, NOW).status).toBe("HISTORICAL_LOW");
  });

  it("builds a fake advertised sale that is not unusual", () => {
    const observations = buildScenario("saleButNotUnusual", NOW);
    const metrics = computeMetrics(observations, NOW);
    expect(metrics.status).toBe("SALE_BUT_NOT_UNUSUAL");
    expect(metrics.advertisedDiscountPercent).toBeGreaterThanOrEqual(20);
  });

  it("builds a fresh significant drop", () => {
    const observations = buildScenario("significantDrop", NOW);
    expect(computeMetrics(observations, NOW).status).toBe("SIGNIFICANT_DROP");
  });

  it("builds a near-historical-low series", () => {
    const observations = buildScenario("nearHistoricalLow", NOW);
    expect(computeMetrics(observations, NOW).status).toBe("NEAR_HISTORICAL_LOW");
  });

  it("builds a short history that cannot claim a historical low", () => {
    const observations = buildScenario("shortHistory", NOW);
    expect(observations.length).toBeLessThan(14);
    expect(computeMetrics(observations, NOW).status).toBe("INSUFFICIENT_HISTORY");
  });
});
