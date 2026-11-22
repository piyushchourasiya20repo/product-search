import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";

const product = {
  id: 1,
  title: "Everyday Bag",
  price: 49.5,
  description: "Useful",
  category: "bags",
  image: "/bag.png",
  rating: { rate: 4.8, count: 12 },
};

describe("ProductCard", () => {
  it("links to product details and exposes its key details", () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1");
    expect(
      screen.getByRole("heading", { name: "Everyday Bag" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$49.50")).toBeInTheDocument();
  });
});
