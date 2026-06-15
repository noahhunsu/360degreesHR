import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./postOnboarding.middleware.js";
import { PostOnboardingController } from "./postOnboarding.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createOnboardingTaskSchema, createOnboardingTaskTemplateSchema } from "./postOnboarding.validation.js";




const router = Router()

router.post("/template" , parseAuthHeaderMiddleware() ,validate(createOnboardingTaskTemplateSchema), PostOnboardingController.createOnboardingTaskTemplateController)

router.get("/template" , parseAuthHeaderMiddleware(), PostOnboardingController.getOnboardingTaskTemplateController)

router.patch("/template/deactivate", parseAuthHeaderMiddleware() , PostOnboardingController.deactivateOnboardingTaskTemplateController)

router.post("/task/:employeeId" , parseAuthHeaderMiddleware() ,validate(createOnboardingTaskSchema) , PostOnboardingController.createOnboardingTaskController )

router.get("/task/me" , parseAuthHeaderMiddleware() , PostOnboardingController.getMyOnboardingTaskController)

router.patch("/task/:taskId/start" , parseAuthHeaderMiddleware() ,PostOnboardingController.startMyOnboardingTaskController )

router.patch("/task/:taskId/complete" , parseAuthHeaderMiddleware() ,PostOnboardingController.completeMyOnboardingTaskController )

router.get("/task/:employeeId/incomplete", parseAuthHeaderMiddleware(),PostOnboardingController.getIncompleteOnboardingTaskController )

export default router