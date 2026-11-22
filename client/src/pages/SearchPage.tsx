import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type Product } from "../api/client";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { ProductGrid } from "../components/ProductGrid";

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const load = () => {
    setStatus("loading");
    void api
      .search(query)
      .then((items) => {
        setProducts(items);
        setStatus("ready");
      })
      .catch((caught) => {
        setError(caught.message);
        setStatus("error");
      });
  };
  useEffect(load, [query]);

  return (
    <section className="section-block listing-page">
      <div className="listing-title">
        <p className="eyebrow">Search the collection</p>
        <h1>“{query}”</h1>
        <p>
          {status === "ready"
            ? `${products.length} result${products.length === 1 ? "" : "s"} found.`
            : ""}
        </p>
      </div>
      {status === "loading" ? (
        <LoadingState />
      ) : status === "error" ? (
        <ErrorState message={error} retry={load} />
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="page-state">
          <h2>Nothing here yet.</h2>
          <p>Try a broader product name, category, or description.</p>
        </div>
      )}
    </section>
  );
}
