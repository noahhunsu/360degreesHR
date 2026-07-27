import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { PerformanceController } from "./performance.controller.js";
import { performanceReviewSchema, performanceTemplateSchema, updatePerformanceTemplateSchema } from "./performance.validation.js";


const router = Router()

router.post("/template" , validate(performanceTemplateSchema), PerformanceController.createPerformanceReviewController)
router.patch("/template/templateId" , validate(updatePerformanceTemplateSchema), PerformanceController.updatePerformanceTemplateController)
router.get("/template" , PerformanceController.getAllPerformanceTemplateController)
router.get("/template/:templateId" , PerformanceController.getSinglePerformanceTemplateController)
router.delete("/template/:templateId" , PerformanceController.deleteSinglePerformanceTemplateController)
router.post("/review" ,  validate(performanceReviewSchema) ,PerformanceController.createPerformanceReviewController)
router.get("/review" ,  PerformanceController.getMyReviewsController)
router.get("/review/:reviewId" , PerformanceController.getMyReviewTasksController)
router.get("/review/instance" , PerformanceController.getAllReviewInstancesController)
router.patch("/review/:reviewId" , PerformanceController.closePerformanceReviewController)

export default router