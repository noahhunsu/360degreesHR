import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./disciplinary.middleware.js";
import { DisciplinaryController } from "./disciplinary.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createDisciplinarySchema, resolveDisciplinarySchema } from "./disciplinary.validation.js";




const router = Router()
router.post("/employees/:employeeId" , parseAuthHeaderMiddleware(),validate(createDisciplinarySchema), DisciplinaryController.createDisciplinaryRecordController)
router.get("/employees/:employeeId" , parseAuthHeaderMiddleware(), DisciplinaryController.getDisciplinaryRecordController)
router.patch("/employees/:disciplinaryId" , parseAuthHeaderMiddleware(),validate(resolveDisciplinarySchema), DisciplinaryController.resolveDisciplinaryRecordController)




export default router