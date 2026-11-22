# Decisions and assumptions

## Choices

- **React + TypeScript:** satisfies the preferred web option, and keeps routes and UI state easy to change independently of the backend.
- **Node.js + TypeScript + Express:** shares the language with the client, provides a small HTTP layer, and has straightforward testing and SMTP support.
- **Local EML mailbox + optional SMTP:** fulfils the sales-email path locally without credentials, containers, or a paid account. The default provider writes standards-based `.eml` files; production can use AWS SES over SMTP without changing the domain contracts.
- **Fake Store API behind the backend:** meets the explicit constraint, protects the product source from client coupling, and leaves the endpoint replaceable.

## Assumptions

1. “Top rated” means numerical `rating.rate`, descending. `rating.count` breaks ties deterministically.
2. The home page is exactly five global products.
3. A category page presents all products in that category, highest-rated first. This satisfies the “top rated” and “additional products” criteria without inventing a separate threshold.
4. Search is case-insensitive and matches title, description, and category. It is submitted explicitly through the search button as requested.
5. Locally, enquiries are delivered to an EML mailbox; with SMTP configured, they are sent to the sales inbox. A failed write or SMTP delivery produces a 502.
6. Catalogue categories and product metadata remain those supplied by Fake Store.
7. No authentication, inventory, payment, analytics, or customer account is part of the stated critical path.

## Simplifications and cuts

- No full image/CDN pipeline; Fake Store image URLs are rendered directly. A production source can supply optimized assets.
- One in-memory, process-local catalogue cache reduces upstream calls but will not share between replicas. Distributed caching can be added when needed.
- No persisted enquiry retry queue. The requirement is a PoC; queueing would add infrastructure and conceal delivery failures without improving this proof path.
- Minimal rate limiting. Validation, request size limits, Helmet, CORS, and dependency boundaries establish the foundation; a gateway or `express-rate-limit` belongs before public deployment.
- No custom visual brand system. The UI establishes a considered, responsive design that can later accept the entrepreneur's final identity.

## Growth path

The `ProductProvider` interface isolates all upstream catalogue behaviour. The `EmailProvider` interface does the same for delivery. Routes are transport-only and delegate search/ranking to `CatalogueService`. A future source can expose richer metadata without making the React components depend on it directly.

The same boundary supports database-backed products, AWS SES, job-based enquiry delivery, observability, authentication, moderation, and a persistent enquiry CRM. The Node application can be deployed on common AWS compute services, and all application configuration is environment based.

## If there were one more day

1. Add end-to-end tests covering the complete browser-to-mailbox journey.
2. Add rate limiting and CSRF/bot protection around enquiry submission.
3. Add a durable outbox or queue for email retries and delivery telemetry.
4. Introduce shared API schemas generated from the backend contract.
5. Add accessibility automation, responsive visual regression checks, and structured product SEO metadata.
6. Introduce CI, dependency scanning, and automated production images.
