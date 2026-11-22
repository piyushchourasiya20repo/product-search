import "dotenv/config";
import {
  closeDatabase,
  initialiseDatabase,
} from "../modules/database/index.js";

async function run(): Promise<void> {
  const source = await initialiseDatabase();
  const migrations = await source.runMigrations();
  process.stdout.write(`Applied ${migrations.length} migration(s).\n`);
}

run()
  .catch((error: unknown) => {
    console.error("Migration failed", error);
    process.exitCode = 1;
  })
  .finally(() => closeDatabase());
