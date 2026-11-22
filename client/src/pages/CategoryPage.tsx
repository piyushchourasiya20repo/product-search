import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type Product } from "../api/client";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { ProductGrid } from "../components/ProductGrid";

export function CategoryPage() {
  const { category = "" } = useParams();
  const name = decodeURIComponent(category);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const load = () => {
    setStatus("loading");
    void api
      .category(name)
      .then((items) => {
        setProducts(items);
        setStatus("ready");
      })
      .catch((caught) => {
        setError(caught.message);
        setStatus("error");
      });
  };
  useEffect(load, [name]);

  return (
    <section className="section-block listing-page">
      <div className="listing-title">
        <p className="eyebrow">Explore the collection</p>
        <h1>{name}</h1>
        <p>
          {products.length
            ? `${products.length} considered essentials, ordered by rating.`
            : "Pieces chosen to earn their place."}
        </p>
      </div>
      {status === "loading" ? (
        <LoadingState />
      ) : status === "error" ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <>
          <div className="section-heading">
            <h2>Highest rated</h2>
            <span>{products.length} pieces</span>
          </div>
          <ProductGrid products={products} />
          {!products.length && (
            <div className="page-state">
              <p>No products found in this category.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
