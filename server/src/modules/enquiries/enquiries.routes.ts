import { Router } from "express";
import {
  EnquiryDeliveryError,
  EnquiryProductNotFoundError,
  EnquiryValidationError,
  type EnquiriesService,
} from "./enquiries.service.js";

export function enquiriesRouter(service: EnquiriesService): Router {
  const router = Router();

  router.post("/enquiries", async (request, response) => {
    try {
      await service.submit(request.body);
      response
        .status(202)
        .json({ message: "Thank you. Our sales team will be in touch soon." });
    } catch (error) {
      if (error instanceof EnquiryValidationError) {
        response
          .status(400)
          .json({ message: error.message, fields: error.fields });
        return;
      }
      if (error instanceof EnquiryProductNotFoundError) {
        response.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof EnquiryDeliveryError) {
        response.status(502).json({ message: error.message });
        return;
      }
      throw error;
    }
  });

  return router;
}
