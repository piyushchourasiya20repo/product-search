# AI usage notes

## Tools and models

Implementation was directed with GitHub Copilot SDK in VS Code using the `mai-code-2` model. The model produced and reviewed source, configuration, tests, and documentation through tool use in the workspace. No hidden answer, upstream solution, or repository was consulted.

## Instructions

No repository-level agent instruction file was present, so default assistant engineering instructions applied. A small session plan tracked scaffolding, backend, frontend, documentation, and validation milestones. The plan is reproduced in this document.

## Plan

1. Scaffold a shared TypeScript repository with a Node API and React web client.
2. Isolate Fake Store and SMTP behind provider interfaces.
3. Implement featured ranking, category browsing, search, product details, and enquiries.
4. Build a responsive catalogue UI and complete async states.
5. Add focused tests, zero-config local email capture, and decision documentation.
6. Run tests and production builds, then review the result manually.

## Key shaping prompts / moments

1. **“plan it”** — converted the challenge into an acceptance-driven, time-boxed architecture and explicit assumptions.
2. **“start implementing it”** — initiated an incremental build rather than generating an unexplained monolith.
3. **“Do not call the Fake Store API directly from the client”** — caused a backend-only product adapter and typed browser API boundary.
4. **“foundation that can grow”** — led to `ProductProvider` and `EmailProvider` contracts rather than route-level SDK calls.
5. **“run locally in under 10 minutes”** — led to a two-command `npm ci` / `npm run dev` path with no containers, accounts, or paid dependencies.

## Corrections and review

- The first scaffold installed current package majors that required newer Node versions. I caught this from engine warnings and pinned Node-18-compatible development packages; the production container uses Node 20.
- The initial implementation included containers for local setup. I removed that incidental infrastructure after direction changed, replacing Mailpit with an in-process EML mailbox so local setup remains zero-config.
- The Vite root initially caused server tests to be skipped. I expanded Vitest's include pattern and ran the suite again to verify the critical backend tests execute.
- Automated tests are not treated as proof of correctness alone: build output, API validation paths, dependency boundaries, and configuration were reviewed against the brief.

## Time spent

The challenge is presented as a 2–3 hour exercise. Actual recorded implementation time will be finalized just before submission.

- Planning: approximately 10 minutes
- Scaffolding and backend: approximately 35 minutes
- Frontend and visual implementation: approximately 35 minutes
- Tests and review: approximately 25 minutes
- Documentation and local setup: approximately 15 minutes
- **Total so far:** approximately 2 hours
