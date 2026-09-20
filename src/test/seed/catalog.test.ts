import { describe, expect, it } from "vitest";
import { seedProducts, seedStores } from "@/lib/seed/catalog";

describe("seed catalog", () => {
  it("includes four demo stores with ten products each", () => {
    expect(seedStores.map((store) => store.slug)).toEqual([
      "carters",
      "lululemon",
      "nike",
      "target",
    ]);
    expect(seedProducts).toHaveLength(40);

    for (const store of seedStores) {
      expect(seedProducts.filter((product) => product.storeSlug === store.slug)).toHaveLength(10);
    }
  });

  it("gives every product a unique slug and external id", () => {
    expect(new Set(seedProducts.map((product) => product.slug)).size).toBe(40);
    expect(new Set(seedProducts.map((product) => product.externalId)).size).toBe(40);
  });
});
