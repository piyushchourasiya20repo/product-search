import type { Product, ProductProvider } from "./catalogue.types.js";

export class CatalogueService {
  constructor(private readonly provider: ProductProvider) {}

  async featured(limit = 5): Promise<Product[]> {
    // Copy before sorting because providers may return a shared cached array.
    return [...(await this.provider.list())]
      .sort(
        // Review count makes equal ratings deterministic rather than source-order dependent.
        (a, b) =>
          b.rating.rate - a.rating.rate || b.rating.count - a.rating.count,
      )
      .slice(0, limit);
  }

  async categories(): Promise<string[]> {
    return [
      ...new Set(
        (await this.provider.list()).map((product) => product.category),
      ),
    ].sort();
  }

  async byCategory(category: string): Promise<Product[]> {
    return (await this.provider.list())
      .filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
      )
      .sort(
        (a, b) =>
          b.rating.rate - a.rating.rate || b.rating.count - a.rating.count,
      );
  }

  async search(term: string): Promise<Product[]> {
    const query = term.trim().toLowerCase();
    if (!query) return [];
    return (await this.provider.list()).filter((product) =>
      [product.title, product.description, product.category].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }

  async get(id: number): Promise<Product | undefined> {
    return this.provider.get(id);
  }
}
