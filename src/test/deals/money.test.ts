import { describe, expect, it } from "vitest";
import { dollarsToCents, formatCents } from "@/lib/money";

describe("dollarsToCents", () => {
  it("converts dollars to integer cents without float leftovers", () => {
    expect(dollarsToCents(79)).toBe(7900);
    expect(dollarsToCents(79.99)).toBe(7999);
    expect(dollarsToCents(0.1 + 0.2)).toBe(30);
  });
});

describe("formatCents", () => {
  it("hides trailing zeros on whole dollars", () => {
    expect(formatCents(7900)).toBe("$79");
  });

  it("keeps cents when they are not zero", () => {
    expect(formatCents(7999)).toBe("$79.99");
  });
});
