import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { AuthController } from "./auth.controller.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordInputSchema } from "./auth.validation.js";


const router = Router()

router.post("/register" , validate(registerSchema), AuthController.registerController)
router.post("/login" , validate(loginSchema), AuthController.loginController)
router.get("/me" , AuthController.authMeController)
router.post("/forgot-password" ,  validate(forgotPasswordSchema), AuthController.forgotPasswordController)
router.post("/reset-password" ,  validate(resetPasswordInputSchema) ,AuthController.resetPasswordController)


export default router