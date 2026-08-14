import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createOnboardingInvitationSchema,  getPresignedUrlInputForPreOnboardingSchema,  onboardingActionSubmissionSchema, saveOnboardingSubmissionSchema } from "./preOnboarding.validation.js";
import { PreOnboardingController } from "./preOnboarding.controller.js";
import multer from "multer";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";



const router = Router()

const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/" ,parseAuthHeaderMiddleware(),upload.single("offerLetter"), validate(createOnboardingInvitationSchema) , PreOnboardingController.createOnboardingInvitationController)
router.post("/submissions/upload-url" ,
    validate(getPresignedUrlInputForPreOnboardingSchema),  
    PreOnboardingController.generatePresignedUrlForPreOnboardingController)
router.get("/invitation/get-all" ,parseAuthHeaderMiddleware(), PreOnboardingController.getAllInvitationsService)
router.get("/token" ,  PreOnboardingController.getOnboardingInvitationController)
router.post("/submit" , validate(saveOnboardingSubmissionSchema) , PreOnboardingController.submitOnboardingDetailsController)
router.get("/submissions" , parseAuthHeaderMiddleware() ,PreOnboardingController.getAllSubmissionsController)
router.get("/submissions/:submissionId" , parseAuthHeaderMiddleware() , PreOnboardingController.getSingleSubmissionsController)
router.patch("/submissions/:submissionId" , parseAuthHeaderMiddleware() ,validate(onboardingActionSubmissionSchema), PreOnboardingController.onboardingSubmissionActionController)
router.post("/submissions/:submissionId/document/:documentId" , parseAuthHeaderMiddleware() , PreOnboardingController.onboardingSubmissionDocumentViewController)

export default router