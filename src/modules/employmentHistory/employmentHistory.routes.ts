import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./employmentHistory.middleware.js";
import { EmploymentHistoryController } from "./employmentHistory.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createEmploymentHistorySchema } from "./employmentHistory.validation.js";



const router = Router()

router.post("/employees/:employeeId" , parseAuthHeaderMiddleware(), validate(createEmploymentHistorySchema),  EmploymentHistoryController.createEmployeeHistoryController)
router.get("/employees/:employeeId" , parseAuthHeaderMiddleware(), EmploymentHistoryController.getEmployeeHistoryController)
// router.put("/employees/:employeeId" , parseAuthHeaderMiddleware(),validate(updateEmploymentHistorySchema), EmploymentHistoryController.updateEmployeeHistoryController)



export default router