import { Router } from "express";
import { EmploymentHistoryController } from "./employmentHistory.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createEmploymentHistorySchema } from "./employmentHistory.validation.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";



const router = Router()

router.post("/employees/:employeeId" , parseAuthHeaderMiddleware(), validate(createEmploymentHistorySchema),  EmploymentHistoryController.createEmployeeHistoryController)
router.get("/employees/:employeeId" , parseAuthHeaderMiddleware(), EmploymentHistoryController.getEmployeeHistoryController)
// router.put("/employees/:employeeId" , parseAuthHeaderMiddleware(),validate(updateEmploymentHistorySchema), EmploymentHistoryController.updateEmployeeHistoryController)



export default router