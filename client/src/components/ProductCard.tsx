import { Link } from "react-router-dom";
import type { Product } from "../api/client";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <div className="product-image-wrap">
        {index !== undefined && (
          <span className="product-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <img
          className="product-image"
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="product-meta">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3>{product.title}</h3>
        </div>
        <div className="product-end">
          <strong>${product.price.toFixed(2)}</strong>
          <span aria-label={`${product.rating.rate} out of 5 stars`}>
            ★ {product.rating.rate}
          </span>
        </div>
      </div>
    </Link>
  );
}
