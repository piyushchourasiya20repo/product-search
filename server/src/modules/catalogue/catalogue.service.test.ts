import { describe, expect, it } from "vitest";
import type { ProductProvider } from "./catalogue.types.js";
import { CatalogueService } from "./catalogue.service.js";
import { products } from "../../test/fixtures.js";

const provider: ProductProvider = {
  list: async () => products,
  get: async (id) => products.find((product) => product.id === id),
};

describe("CatalogueService", () => {
  const catalogue = new CatalogueService(provider);

  it("returns the five globally highest-rated products", async () => {
    expect((await catalogue.featured()).map(({ id }) => id)).toEqual([
      1, 3, 4, 5, 6,
    ]);
  });

  it("returns a category with highest-rated products first", async () => {
    expect((await catalogue.byCategory("bags")).map(({ id }) => id)).toEqual([
      1, 3,
    ]);
  });

  it("searches title, description, and category without case sensitivity", async () => {
    expect((await catalogue.search("STEEL")).map(({ id }) => id)).toEqual([2]);
    expect((await catalogue.search("bags")).map(({ id }) => id)).toEqual([
      1, 3,
    ]);
  });

  it("returns no search results for blank input", async () => {
    expect(await catalogue.search("   ")).toEqual([]);
  });
});
