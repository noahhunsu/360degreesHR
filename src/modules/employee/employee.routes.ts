import { Router } from "express";
import { EmployeeController } from "./employee.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation.js";
import multer from "multer";
import { parseAuthHeaderMiddleware, parseAuthorizationMiddleware, requiredPermission } from "../../shared/middleware/auth.middleware.js";



const router = Router()
const upload = multer({
    storage : multer.memoryStorage()
})

router.post("/" , parseAuthHeaderMiddleware() ,parseAuthorizationMiddleware(), requiredPermission(["create_employee"]), validate(createEmployeeSchema ) , EmployeeController.createEmployeeController)
router.get("/bulk-upload/template", parseAuthHeaderMiddleware(), EmployeeController.downloadBulkUploadTemplateController,
);
router.post("/bulk-uploads" , parseAuthHeaderMiddleware(), upload.single("file"), EmployeeController.createBulkEmployeeViaSheetController)
router.get("/" , parseAuthHeaderMiddleware(), EmployeeController.getAllEmployeesController)
router.get("/for-employee" , parseAuthHeaderMiddleware(), EmployeeController.getAllForEmployeeController)
router.get("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.getSingleEmployeeController)
router.put("/:employeeId" , parseAuthHeaderMiddleware(), requiredPermission(["update_employee"]), validate(updateEmployeeSchema) ,EmployeeController.updateEmployeeController)
router.delete("/:employeeId" , parseAuthHeaderMiddleware(), requiredPermission(["delete_employee"]) , EmployeeController.deleteEmployeeController)


export default router