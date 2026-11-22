import nodemailer from "nodemailer";
import type { EnquiryOutboxPayload } from "../enquiries/index.js";
import type { EmailService } from "./email.types.js";

export class NodemailerEmailService implements EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD?.replace(/\s/g, ""),
    },

    logger: true,
    debug: true,
  });

  async sendEnquiry({ enquiry, product }: EnquiryOutboxPayload): Promise<void> {
    if (!process.env.SMTP_HOST || !process.env.SALES_INBOX) {
      throw new Error(
        "SMTP_HOST and SALES_INBOX are required to send enquiry email",
      );
    }

    try {

      console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  userConfigured: !!process.env.SMTP_USER,
  passwordConfigured: !!process.env.SMTP_PASSWORD,
});
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
        to: process.env.SALES_INBOX,
        replyTo: enquiry.email,
        subject: `Product enquiry: ${product.title}`,
        text: [
          `Product: ${product.title} (#${product.id})`,
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          "",
          enquiry.message,
        ].join("\n"),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to send enquiry email: ${message}`, {
        cause: error,
      });
    }
  }
}
