export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.message ?? "Something went wrong. Please try again.");
  return body as T;
}

export const api = {
  featured: () => request<Product[]>("/products/featured"),
  categories: () => request<string[]>("/categories"),
  category: (name: string) =>
    request<Product[]>(`/products/category/${encodeURIComponent(name)}`),
  search: (term: string) =>
    request<Product[]>(`/products/search?q=${encodeURIComponent(term)}`),
  product: (id: number) => request<Product>(`/products/${id}`),
  enquire: (details: {
    productId: number;
    name: string;
    email: string;
    message: string;
  }) =>
    request<{ message: string }>("/enquiries", {
      method: "POST",
      body: JSON.stringify(details),
    }),
};
