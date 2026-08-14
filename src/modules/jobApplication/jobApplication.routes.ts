import { Router } from "express";
import { JobApplicationController, } from "./jobApplication.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { moveJobApplicationInputSchema, rejectJobApplicationInputSchema } from "./jobApplication.validation.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";




const router = Router()

// router.get(
//   "/upload-url,
//   validate(),
//   JobApplicationController.createJobApplicationController);
router.post("/job-openings/:jobOpeningId" , JobApplicationController.createJobApplicationController)
router.get("/" , parseAuthHeaderMiddleware() ,  JobApplicationController.getAllJobApplicationController)
router.get("/:applicationId" , parseAuthHeaderMiddleware() ,  JobApplicationController.getSingleJobApplicationController)
router.get("/:applicationId/document/:documentId" , parseAuthHeaderMiddleware() , JobApplicationController.applicationSubmissionDocumentViewController)
router.patch("/:applicationId/move", parseAuthHeaderMiddleware() , validate(moveJobApplicationInputSchema) , JobApplicationController.moveJobApplicationController)
router.patch("/:applicationId/reject", parseAuthHeaderMiddleware() , validate(rejectJobApplicationInputSchema) , JobApplicationController.rejectJobApplicationController)
router.post("/upload/upload-url" ,  JobApplicationController.generatePresignedUrlApplicationController)


export default router