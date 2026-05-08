import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";


const router = Router()

router.post("/register" , validate(registerSchema), AuthController.register)
router.post("/login" , validate(loginSchema), AuthController.login)

export default router