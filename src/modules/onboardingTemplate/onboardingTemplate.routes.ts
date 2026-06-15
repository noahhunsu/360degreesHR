import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./onboardingTemplate.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { OnboardingTemplateController } from "./onboardingTemplate.controller.js";
import { createOnboardingTemplateSchema, updateSingleOnboardingTemplateSchema } from "./onboardingTemplate.validation.js";




const router = Router()
router.post("/" , parseAuthHeaderMiddleware(),validate(createOnboardingTemplateSchema), OnboardingTemplateController.createOnboardingTemplateController)
router.get("/" , parseAuthHeaderMiddleware(), OnboardingTemplateController.getOnboardingTemplateController)
router.get("/:templateId" , parseAuthHeaderMiddleware(), OnboardingTemplateController.getSingleOnboardingTemplateController)
router.put("/:templateId" , parseAuthHeaderMiddleware(),validate(updateSingleOnboardingTemplateSchema), OnboardingTemplateController.updateOnboardingTemplateController)
router.delete("/:templateId" , parseAuthHeaderMiddleware(), OnboardingTemplateController.deleteOnboardingTemplateController)



export default router