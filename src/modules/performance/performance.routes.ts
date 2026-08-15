import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { PerformanceController } from "./performance.controller.js";
import { performanceReviewSchema, performanceTemplateSchema, updatePerformanceTemplateSchema } from "./performance.validation.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";


const router = Router()

// TEMPLATE ROUTES (specific first)
router.post("/template/create", parseAuthHeaderMiddleware(), validate(performanceTemplateSchema), PerformanceController.createPerformanceReviewController)
router.get("/template", parseAuthHeaderMiddleware(), PerformanceController.getAllPerformanceTemplateController)
router.get("/template/:templateId", parseAuthHeaderMiddleware(), PerformanceController.getSinglePerformanceTemplateController)
router.patch("/template/:templateId", parseAuthHeaderMiddleware(), validate(updatePerformanceTemplateSchema), PerformanceController.updatePerformanceTemplateController)
router.delete("/template/:templateId", parseAuthHeaderMiddleware(), PerformanceController.deleteSinglePerformanceTemplateController)

// REVIEW ROUTES (specific first, generic last)
// router.post("/review", parseAuthHeaderMiddleware(), validate(performanceReviewSchema), PerformanceController.createPerformanceReviewController)
router.get("/review/instance", parseAuthHeaderMiddleware(), PerformanceController.getAllReviewInstancesController)  // SPECIFIC FIRST
router.get("/review", parseAuthHeaderMiddleware(), PerformanceController.getMyReviewsController)
router.get("/review/:reviewId", parseAuthHeaderMiddleware(), PerformanceController.getMyReviewTasksController)  // GENERIC LAST
router.patch("/review/:reviewId", parseAuthHeaderMiddleware(), PerformanceController.closePerformanceReviewController)

export default router