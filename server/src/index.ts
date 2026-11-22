import "dotenv/config";
import { createApp } from "./app.js";
import { FakeStoreProductProvider } from "./modules/catalogue/index.js";
import { closeDatabase } from "./modules/database/index.js";
import { NodemailerEmailService } from "./modules/email/index.js";
import { createOutbox } from "./startup.js";

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3001);
  const outbox = await createOutbox();
  const email = new NodemailerEmailService();
  const app = createApp(new FakeStoreProductProvider(), outbox, email);
  const server = app.listen(port, () =>
    console.log(`API listening on http://localhost:${port}`),
  );
  const shutdown = async () => {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

start().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
