import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api/client";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { SearchPage } from "./pages/SearchPage";

function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void api
      .categories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          ATELIER<span>Objects for every day</span>
        </Link>
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (search.trim())
              navigate(`/search?q=${encodeURIComponent(search.trim())}`);
          }}
        >
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection"
          />
          <button aria-label="Search">
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <nav aria-label="Categories">
          <Link to="/">New & notable</Link>
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="*"
            element={
              <section className="page-state">
                <h1>Page not found</h1>
                <Link to="/">Return to the collection</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <strong>ATELIER</strong>
        <span>A considered collection, made simple.</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;
