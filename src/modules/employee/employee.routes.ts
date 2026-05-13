import { Router } from "express";
import { EmployeeController } from "./employee.controller.js";
import { parseAuthHeaderMiddleware } from "./employee.middleware.js";



const router = Router()

router.post("/" , parseAuthHeaderMiddleware(), EmployeeController.createEmployeeController)
router.get("/" , parseAuthHeaderMiddleware(), EmployeeController.getAllEmployeesController)
router.get("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.getSingleEmployeeController)
router.put("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.updateEmployeeController)
router.delete("/:employeeId" , parseAuthHeaderMiddleware(), EmployeeController.deleteEmployeeController)


export default router