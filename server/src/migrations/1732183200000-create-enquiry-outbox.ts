import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnquiryOutbox1732183200000 implements MigrationInterface {
  name = "CreateEnquiryOutbox1732183200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`
      CREATE TABLE "enquiry_outbox" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "payload" jsonb NOT NULL,
        "attempts" integer NOT NULL DEFAULT 0,
        "available_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "claimed_at" timestamptz,
        "failed_at" timestamptz,
        "last_error" text,
        CONSTRAINT "PK_enquiry_outbox_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_enquiry_outbox_available_at_failed_at"
      ON "enquiry_outbox" ("available_at", "failed_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_enquiry_outbox_available_at_failed_at"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "enquiry_outbox"`);
  }
}
