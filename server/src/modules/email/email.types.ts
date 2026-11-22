import type { EnquiryOutboxPayload } from "../enquiries/index.js";

export interface EmailService {
  sendEnquiry(payload: EnquiryOutboxPayload): Promise<void>;
}
