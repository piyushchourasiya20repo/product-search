import { initialiseDatabase } from "./modules/database/index.js";
import type { EnquiryOutboxPayload } from "./modules/enquiries/index.js";
import { PostgresOutbox, type Outbox } from "./modules/outbox/index.js";

export async function createOutbox(): Promise<Outbox<EnquiryOutboxPayload>> {
  const source = await initialiseDatabase();
  return new PostgresOutbox<EnquiryOutboxPayload>(source);
}
