# Repository guidance

- Keep the browser behind `/api`; never call upstream catalogue services from React.
- Preserve provider interfaces for catalogue and email implementations.
- Add focused tests for ranking, validation, transport errors, API documentation, and critical UI behaviour.
- Do not commit secrets or populated `.env` files.
- Keep local review possible without paid accounts.
- Record significant assumptions in `DECISIONS.md` and meaningful AI workflow changes in `AI_USAGE.md`.
