import { useEffect, useState } from "react";
import { api, type Product } from "../api/client";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { ProductGrid } from "../components/ProductGrid";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const load = () => {
    setError("");
    void api
      .featured()
      .then(setProducts)
      .catch((caught) => setError(caught.message));
  };
  useEffect(load, []);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">The selection, Spring 2026</p>
        <h1>
          Useful things.
          <br />
          <em>Beautifully found.</em>
        </h1>
        <p className="hero-copy">
          A rotating edit of the most-loved pieces from our catalogue. Selected
          for the way they look, work and last.
        </p>
        <span className="hero-mark" aria-hidden="true">
          A
        </span>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Top rated by our community</p>
            <h2>This week's edit</h2>
          </div>
          <span>01 — 05</span>
        </div>
        {!products.length && !error ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} retry={load} />
        ) : (
          <ProductGrid products={products} numbered />
        )}
      </section>
      <section className="manifesto">
        <p>Fewer, better things.</p>
        <h2>
          Not more choice.
          <br />A better choice.
        </h2>
        <span>
          Thoughtfully sourced · Transparently priced · Ready to enquire
        </span>
      </section>
    </>
  );
}
