import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import type { ProductProvider } from "../modules/catalogue/index.js";
import type { EmailService } from "../modules/email/index.js";
import type { EnquiryOutboxPayload } from "../modules/enquiries/index.js";
import type { Outbox } from "../modules/outbox/index.js";
import { products } from "./fixtures.js";

const provider: ProductProvider = {
  list: vi.fn(async () => products),
  get: vi.fn(async (id) => products.find((product) => product.id === id)),
};
const enqueue = vi.fn(async () => undefined);
const outbox: Outbox<EnquiryOutboxPayload> = { enqueue };
const sendEnquiry = vi.fn(async () => undefined);
const email: EmailService = { sendEnquiry };
const app = createApp(provider, outbox, email);

describe("catalogue API", () => {
  it("serves the OpenAPI document and Swagger UI", async () => {
    const document = await request(app).get("/openapi.json").expect(200);
    expect(document.body.openapi).toBe("3.0.3");
    expect(document.body.paths["/enquiries"].post).toBeDefined();
    const ui = await request(app).get("/api-docs/").expect(200);
    expect(ui.text).toContain("Atelier API Documentation");
    expect(ui.text).toContain("swagger-ui-bundle.js");
  });

  it("provides featured products", async () => {
    const response = await request(app)
      .get("/api/products/featured")
      .expect(200);
    expect(response.body).toHaveLength(5);
  });

  it("returns 404 for an unknown product", async () => {
    await request(app)
      .get("/api/products/999")
      .expect(404, { message: "Product not found" });
  });

  it("validates enquiry details", async () => {
    await request(app)
      .post("/api/enquiries")
      .send({ productId: 1, name: "A", email: "invalid", message: "short" })
      .expect(400);
    expect(enqueue).not.toHaveBeenCalled();
  });

  it("queues a valid enquiry", async () => {
    const response = await request(app)
      .post("/api/enquiries")
      .send({
        productId: 1,
        name: "Alex Smith",
        email: "alex@example.com",
        message: "Please tell me more about this item.",
      })
      .expect(202);
    expect(response.body.message).toMatch(/Thank you/);
    const payload = {
      enquiry: expect.objectContaining({ productId: 1 }),
      product: expect.objectContaining({ id: 1 }),
    };
    expect(enqueue).toHaveBeenCalledWith(payload);
    expect(sendEnquiry).toHaveBeenCalledWith(payload);
  });
});
