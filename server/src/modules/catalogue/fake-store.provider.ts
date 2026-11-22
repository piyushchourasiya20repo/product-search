import type { Product, ProductProvider } from "./catalogue.types.js";

export class ProductSourceError extends Error {}

export class FakeStoreProductProvider implements ProductProvider {
  private cache?: { products: Product[]; expiresAt: number };

  constructor(
    private readonly baseUrl = process.env.PRODUCT_API_URL ??
      "https://fakestoreapi.com",
    private readonly ttlMs = Number(
      process.env.PRODUCT_CACHE_TTL_MS ?? 300_000,
    ),
  ) {}

  async list(): Promise<Product[]> {
    // Keep the mutable upstream URL isolated while avoiding repeated calls during a browse session.
    if (this.cache && this.cache.expiresAt > Date.now())
      return this.cache.products;

    // The public source has no request contract for callers, so cap each attempt locally.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(
        `${this.baseUrl.replace(/\/$/, "")}/products`,
        {
          signal: controller.signal,
        },
      );
      if (!response.ok)
        throw new ProductSourceError(`Product API returned ${response.status}`);
      const products = (await response.json()) as Product[];
      this.cache = { products, expiresAt: Date.now() + this.ttlMs };
      return products;
    } catch (error) {
      if (error instanceof ProductSourceError) throw error;
      throw new ProductSourceError(
        "Product catalogue is temporarily unavailable",
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  async get(id: number): Promise<Product | undefined> {
    return (await this.list()).find((product) => product.id === id);
  }
}
