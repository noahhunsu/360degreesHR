import { Router } from "express";
import { EmployeeController } from "./employee.controller.js";
import { parseAuthHeaderMiddleware } from "./employee.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation.js";
import multer from "multer";



const router = Router()
const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/" , parseAuthHeaderMiddleware(), validate(createEmployeeSchema ), EmployeeController.createEmployeeController)
router.post("/bulk-uploads" , parseAuthHeaderMiddleware(), upload.single("file"), EmployeeController.createBulkEmployeeViaSheetController)
router.get("/" , parseAuthHeaderMiddleware(), EmployeeController.getAllEmployeesController)
router.get("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.getSingleEmployeeController)
router.put("/:employeeId" , parseAuthHeaderMiddleware(), validate(updateEmployeeSchema) ,EmployeeController.updateEmployeeController)
router.delete("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.deleteEmployeeController)


export default router