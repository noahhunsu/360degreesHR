import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./preOnboarding.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createOnboardingInvitationSchema, getOnboardingInvitationSchema, onboardingActionSubmissionSchema, saveOnboardingSubmissionSchema } from "./preOnboarding.validation.js";
import { PreOnboardingController } from "./preOnboarding.controller.js";
import multer from "multer";



const router = Router()

const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/" ,parseAuthHeaderMiddleware(),upload.single("offerLetter"), validate(createOnboardingInvitationSchema) , PreOnboardingController.createOnboardingInvitationController)
router.get("/token" ,  PreOnboardingController.getOnboardingInvitationController)
router.post("/submit" , validate(saveOnboardingSubmissionSchema) , PreOnboardingController.submitOnboardingDetailsController)
router.get("/submissions" , parseAuthHeaderMiddleware() ,PreOnboardingController.getAllSubmissionsController)
router.get("/submissions/:submissionId" , parseAuthHeaderMiddleware() , PreOnboardingController.getSingleSubmissionsController)
router.post("/submissions/:submissionId" , parseAuthHeaderMiddleware() ,validate(onboardingActionSubmissionSchema), PreOnboardingController.onboardingSubmissionActionController)
export default router