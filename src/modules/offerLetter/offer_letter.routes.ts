
import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";
import { OfferLetterController } from "./offer_letter.controller.js";
import { offerLetterSchema } from "./offer_letter.validation.js";



const router = Router()

router.post("/template/upload-url" ,  parseAuthHeaderMiddleware(), OfferLetterController.generatePresignedUrlForOfferController)
router.post("/upload-template" ,  parseAuthHeaderMiddleware(), validate(offerLetterSchema), OfferLetterController.uploadOfferLetterController)
router.get("/get-template" ,  parseAuthHeaderMiddleware(), OfferLetterController.getOfferLetterController)
router.get("/download-template" ,  parseAuthHeaderMiddleware(), OfferLetterController.downloadOfferLetterTemplateController)


export default router