import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateEnquiryOutbox1732183200000 } from "../../migrations/1732183200000-create-enquiry-outbox.js";
import { EnquiryOutboxSchema } from "./enquiry-outbox.entity.js";

let dataSource: DataSource | undefined;

export function database(): DataSource {
  dataSource ??= new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_NAME ?? "product_search",
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : false,
    synchronize: false,
    migrationsRun: true,
    migrations: [CreateEnquiryOutbox1732183200000],
    logging: process.env.TYPEORM_LOGGING === "true",
    entities: [EnquiryOutboxSchema],
    poolSize: Number(process.env.DATABASE_POOL_MAX ?? 10),
  });
  return dataSource;
}

async function ensureDatabaseExists(): Promise<void> {
  const name = process.env.DB_NAME ?? "product_search";
  if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error("Invalid DB_NAME");
  const admin = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: "postgres",
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : false,
  });
  await admin.initialize();
  try {
    const rows = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [name],
    );
    if (rows.length === 0) {
      await admin.query(`CREATE DATABASE "${name}"`);
    }
  } finally {
    await admin.destroy();
  }
}

export async function initialiseDatabase(): Promise<DataSource> {
  await ensureDatabaseExists();
  const source = database();
  if (!source.isInitialized) await source.initialize();
  return source;
}

export async function closeDatabase(): Promise<void> {
  if (dataSource?.isInitialized) await dataSource.destroy();
  dataSource = undefined;
}
