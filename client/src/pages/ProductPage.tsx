import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type Product } from "../api/client";
import { ErrorState, LoadingState } from "../components/AsyncState";

export function ProductPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    void api
      .product(Number(id))
      .then(setProduct)
      .catch((caught) => setError(caught.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) return;
    const values = new FormData(event.currentTarget);
    setSubmitting(true);
    setFormError("");
    try {
      await api.enquire({
        productId: product.id,
        name: String(values.get("name")),
        email: String(values.get("email")),
        message: String(values.get("message")),
      });
      setSent(true);
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "Unable to send your enquiry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <section className="section-block">
        <LoadingState />
      </section>
    );
  if (error || !product)
    return <ErrorState message={error || "Product not found."} retry={load} />;

  return (
    <section className="product-detail">
      <Link className="back-link" to="/">
        ← Back to the collection
      </Link>
      <div className="product-detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <div className="detail-price">
            <strong>${product.price.toFixed(2)}</strong>
            <span>
              ★ {product.rating.rate} · {product.rating.count} reviews
            </span>
          </div>
          <p className="description">{product.description}</p>
          {!formOpen ? (
            <button
              className="button button-full"
              onClick={() => setFormOpen(true)}
            >
              Enquire about this piece <span>↗</span>
            </button>
          ) : sent ? (
            <div className="thank-you" role="status">
              <span>✓</span>
              <div>
                <h2>Thank you.</h2>
                <p>
                  Our sales team has your enquiry and will be in touch soon.
                </p>
              </div>
            </div>
          ) : (
            <form className="enquiry-form" onSubmit={submit}>
              <h2>Start a conversation</h2>
              <p>Tell us what you need and our team will get back to you.</p>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
              <label>
                How can we help?
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={2000}
                  required
                  defaultValue={`Hi, I’m interested in ${product.title}.`}
                />
              </label>
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <button className="button button-full" disabled={submitting}>
                {submitting ? "Sending…" : "Send enquiry"} <span>↗</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
