import { Router } from "express";
import type { CatalogueService } from "./catalogue.service.js";

export function catalogueRouter(catalogue: CatalogueService): Router {
  const router = Router();

  router.get("/categories", async (_request, response) =>
    response.json(await catalogue.categories()),
  );
  router.get("/products/featured", async (_request, response) =>
    response.json(await catalogue.featured()),
  );
  router.get("/products/search", async (request, response) => {
    const query = typeof request.query.q === "string" ? request.query.q : "";
    response.json(await catalogue.search(query));
  });
  router.get("/products/category/:category", async (request, response) => {
    response.json(
      await catalogue.byCategory(decodeURIComponent(request.params.category)),
    );
  });
  router.get("/products/:id", async (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
      response.status(400).json({ message: "Invalid product id" });
      return;
    }
    const product = await catalogue.get(id);
    if (!product) {
      response.status(404).json({ message: "Product not found" });
      return;
    }
    response.json(product);
  });

  return router;
}
