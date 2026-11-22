import type { DataSource } from "typeorm";
import {
  EnquiryOutboxSchema,
  type EnquiryOutboxEntity,
} from "../database/index.js";
import type { Outbox } from "./outbox.types.js";

export class PostgresOutbox<T> implements Outbox<T> {
  constructor(private readonly dataSource: DataSource) {}

  async enqueue(payload: T): Promise<void> {
    // Use the shared DataSource so writes reuse its pool and entity mapping.
    const repository =
      this.dataSource.getRepository<EnquiryOutboxEntity>(EnquiryOutboxSchema);

    // Persist the complete event for recovery and operational auditing. Email delivery
    // is coordinated by the enquiry service after this durable write succeeds.
    await repository.insert({ payload: payload as object });
  }
}
