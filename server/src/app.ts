import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";
import {
  CatalogueService,
  catalogueRouter,
  type ProductProvider,
} from "./modules/catalogue/index.js";
import {
  EnquiriesService,
  enquiriesRouter,
  type EnquiryOutboxPayload,
} from "./modules/enquiries/index.js";
import type { Outbox } from "./modules/outbox/index.js";
import type { EmailService } from "./modules/email/index.js";

export function createApp(
  productProvider: ProductProvider,
  outbox: Outbox<EnquiryOutboxPayload>,
  email: EmailService,
) {
  const app = express();
  const catalogue = new CatalogueService(productProvider);
  const enquiries = new EnquiriesService(catalogue, outbox, email);

  app.use(helmet());
  app.use(
    cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }),
  );
  app.use(express.json({ limit: "20kb" }));
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: "Atelier API Documentation",
    }),
  );
  app.get("/openapi.json", (_request, response) =>
    response.json(openApiDocument),
  );
  app.use("/api", catalogueRouter(catalogue));
  app.use("/api", enquiriesRouter(enquiries));
  // API and documentation routes must be registered before the client-side route fallback.
  if (process.env.NODE_ENV === "production") {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
    const clientDirectory = path.resolve(currentDirectory, "../client");
    app.use(express.static(clientDirectory));
    app.get(/.*/, (_request, response) =>
      response.sendFile(path.join(clientDirectory, "index.html")),
    );
  }
  app.use((_request, response) =>
    response.status(404).json({ message: "Not found" }),
  );
  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      next: NextFunction,
    ) => {
      void next;
      console.error(error);
      response.status(503).json({
        message: error instanceof Error ? error.message : "Service unavailable",
      });
    },
  );

  return app;
}
