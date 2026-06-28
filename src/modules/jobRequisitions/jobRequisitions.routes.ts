import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./jobRequisitions.middleware.js";
import { JobRequisitionController} from "./jobRequisitions.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { acceptOrRejectRequisitionInputSchema, createJobRequisitionInputSchema, updateJobRequisitionInputSchema } from "./jobRequisitions.validation.js";

const router = Router()

router.post("/" , parseAuthHeaderMiddleware() ,validate(createJobRequisitionInputSchema), JobRequisitionController.createJobRequisitionController)
router.get("/" , parseAuthHeaderMiddleware(),  JobRequisitionController.getAllRequisitionController)
router.get("/stats" , parseAuthHeaderMiddleware(), JobRequisitionController.getJobRequisitionStatsController)
router.get("/:requisitionId" , parseAuthHeaderMiddleware(),  JobRequisitionController.getAllRequisitionController)
router.patch("/:requisitionId" , parseAuthHeaderMiddleware(), validate(updateJobRequisitionInputSchema) , JobRequisitionController.updateJobRequisitionController)
router.delete("/:requisitionId" , parseAuthHeaderMiddleware(), JobRequisitionController.cancelJobRequisitionController)
router.patch("/:requisitionId/review" , parseAuthHeaderMiddleware(), validate(acceptOrRejectRequisitionInputSchema) ,JobRequisitionController.acceptOrRejectRequisitionController)

export default router