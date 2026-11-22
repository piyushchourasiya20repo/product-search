import { EntitySchema } from "typeorm";

export interface EnquiryOutboxEntity {
  id: string;
  payload: object;
  attempts: number;
  availableAt: Date;
  createdAt: Date;
  claimedAt: Date | null;
  failedAt: Date | null;
  lastError: string | null;
}

export const EnquiryOutboxSchema = new EntitySchema<EnquiryOutboxEntity>({
  name: "EnquiryOutbox",
  tableName: "enquiry_outbox",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    payload: { type: "jsonb" },
    attempts: { type: "int", default: 0 },
    availableAt: {
      name: "available_at",
      type: "timestamptz",
      createDate: true,
    },
    createdAt: { name: "created_at", type: "timestamptz", createDate: true },
    claimedAt: { name: "claimed_at", type: "timestamptz", nullable: true },
    failedAt: { name: "failed_at", type: "timestamptz", nullable: true },
    lastError: { name: "last_error", type: "text", nullable: true },
  },
  indices: [{ columns: ["availableAt", "failedAt"] }],
});
