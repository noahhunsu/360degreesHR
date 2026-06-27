import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./jobCreation.middleware.js";
import { JobOpeningCreationController} from "./jobCreation.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createJobOpeningSchema, updateJobOpeningInputSchema } from "./jobCreation.validation.js";




const router = Router()

router.get(
  "/job-openings/stats",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.getJobOpeningStatsController,
);

router.get(
  "/companies/:companyId/job-openings",
  JobOpeningCreationController.getPublishedJobOpeningController,
);

router.get(
  "/companies/:companyId/job-openings/:jobOpeningId",
  JobOpeningCreationController.getSinglePublishedJobOpeningController,
);

router.get(
  "/job-openings",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.getAllJobOpeningController,
);

router.get(
  "/job-openings/:jobOpeningId",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.getSingleJobOpeningController,
);

router.post(
  "/job-openings",
  parseAuthHeaderMiddleware(),
  validate(createJobOpeningSchema),
  JobOpeningCreationController.createJobOpeningController,
);

router.patch(
  "/job-openings/:jobOpeningId",
  parseAuthHeaderMiddleware(),
  validate(updateJobOpeningInputSchema),
  JobOpeningCreationController.updateJobOpeningController,
);

router.patch(
  "/job-openings/:jobOpeningId/publish",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.publishJobOpeningController,
);

router.patch(
  "/job-openings/:jobOpeningId/close",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.closeJobOpeningController,
);

router.patch(
  "/job-openings/:jobOpeningId/reopen",
  parseAuthHeaderMiddleware(),
  JobOpeningCreationController.reOpenJobOpeningController,
);
export default router