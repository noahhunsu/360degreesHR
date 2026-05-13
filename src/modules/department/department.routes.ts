import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./department.middleware.js";
import { DepartmentController } from "./department.controller.js";




const router = Router()
router.post("/" , parseAuthHeaderMiddleware(), DepartmentController.createDepartmentController)
router.get("/" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentsController)
router.get("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.getSingleDepartmentController)
router.put("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.updateDepartmentController)
router.delete("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.deleteDepartmentController)
router.get("/tree" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentTreeController)



export default router