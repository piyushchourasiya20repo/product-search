import type { Product } from "../catalogue/index.js";

export interface Enquiry {
  productId: number;
  name: string;
  email: string;
  message: string;
}

export interface EnquiryOutboxPayload {
  enquiry: Enquiry;
  product: Product;
}
