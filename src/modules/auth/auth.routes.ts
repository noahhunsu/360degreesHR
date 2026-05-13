import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordInputSchema } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";


const router = Router()

router.post("/register" , validate(registerSchema), AuthController.registerController)
router.post("/login" , validate(loginSchema), AuthController.loginController)
router.post("/forgot-password" ,  validate(forgotPasswordSchema), AuthController.forgotPasswordController)
router.post("/reset-password" ,  validate(resetPasswordInputSchema) ,AuthController.resetPasswordController)
router.get("/me" , AuthController.authMeController)

export default router