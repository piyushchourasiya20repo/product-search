# Atelier product catalogue

A deliberately small, production-shaped catalogue built with a React/TypeScript client and Node.js/TypeScript/Express backend. Product data is fetched by the backend from the Fake Store API; the browser never calls it directly. Enquiries are stored as valid email files locally, or sent through a configured SMTP provider.

## Run locally

Prerequisite: Node.js 20+.

```bash
npm ci
npm run migration:run
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001`. No account, API key, or external email service is required.

Submitted enquiries are first durably written to a PostgreSQL outbox through TypeORM, then sent immediately with Nodemailer. The outbox retains the event for recovery or later audit/processing if delivery needs operational follow-up.

## Quality checks

```bash
npm test
npm run build
```

Tests cover ranking, category ordering, search matching, API status handling, enquiry validation/delivery, and product card navigation.

## API

Interactive Swagger UI is available at `http://localhost:3001/api-docs/`. The raw OpenAPI 3 document is available at `http://localhost:3001/openapi.json`.

- `GET /api/products/featured` — five highest-rated products
- `GET /api/products/category/:category` — one category, rating descending
- `GET /api/products/search?q=term` — title, description, or category match
- `GET /api/products/:id` — product details
- `GET /api/categories` — available categories
- `POST /api/enquiries` — validated enquiry persisted to the outbox for delivery

## Configuration

Configuration is optional for the local zero-account workflow. Copy `.env.example` when you want custom API, cache, mailbox, or SMTP settings. Leaving `SMTP_HOST` blank selects the local EML mailbox; setting it selects the SMTP adapter for a production provider without changing application code. Never commit a populated `.env`.

## Project structure

```text
client/src/       React application and typed API client
server/src/
  modules/catalogue/
    catalogue.routes.ts   HTTP routes
    catalogue.service.ts  Catalogue use cases
    catalogue.types.ts    Module contracts
    fake-store.provider.ts
  modules/enquiries/
    enquiries.routes.ts   HTTP routes
    enquiries.service.ts  Validation and outbox use case
  modules/database/
    postgres.ts           TypeORM data source and migration setup
  modules/outbox/
    postgres.outbox.ts    PostgreSQL persistence implementation
    enquiries.types.ts    Module contracts
    local-email.provider.ts
    smtp-email.provider.ts
```

The core catalogue service depends on interfaces rather than transport-specific code. Replacing Fake Store with a database or commerce API only requires another `ProductProvider`; a separate delivery service can consume enquiry outbox records without coupling itself to the HTTP API.

For assumptions, trade-offs, and follow-up work, see [DECISIONS.md](./DECISIONS.md). See [AI_USAGE.md](./AI_USAGE.md) for AI workflow notes and time tracking.
