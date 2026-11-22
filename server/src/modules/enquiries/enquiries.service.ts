import { z } from "zod";
import type { CatalogueService } from "../catalogue/index.js";
import type { EmailService } from "../email/index.js";
import type { Outbox } from "../outbox/index.js";
import type { Enquiry, EnquiryOutboxPayload } from "./enquiries.types.js";

const enquirySchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(2_000),
});

export class EnquiryValidationError extends Error {
  constructor(readonly fields: Record<string, string[] | undefined>) {
    super("Please check the enquiry details");
  }
}

export class EnquiryProductNotFoundError extends Error {
  constructor() {
    super("Product not found");
  }
}

export class EnquiryDeliveryError extends Error {
  constructor() {
    super("We could not save or send your enquiry. Please try again.");
  }
}

export class EnquiriesService {
  constructor(
    private readonly catalogue: CatalogueService,
    private readonly outbox: Outbox<EnquiryOutboxPayload>,
    private readonly email: EmailService,
  ) {}

  async submit(input: unknown): Promise<void> {
    const result = enquirySchema.safeParse(input);
    if (!result.success) {
      throw new EnquiryValidationError(result.error.flatten().fieldErrors);
    }

    const enquiry: Enquiry = result.data;
    const product = await this.catalogue.get(enquiry.productId);
    if (!product) throw new EnquiryProductNotFoundError();

    try {
      const payload = { enquiry, product };
      // Persist first so the enquiry remains recoverable if email delivery fails.
      await this.outbox.enqueue(payload);
      await this.email.sendEnquiry(payload);
    } catch {
      throw new EnquiryDeliveryError();
    }
  }
}
