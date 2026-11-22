import type { Product } from "../api/client";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  numbered = false,
}: {
  products: Product[];
  numbered?: boolean;
}) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={numbered ? index : undefined}
        />
      ))}
    </div>
  );
}
