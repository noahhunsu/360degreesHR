import { Router } from "express";
import { DepartmentController } from "./department.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";




const router = Router()
router.post("/" , parseAuthHeaderMiddleware(),validate(createDepartmentSchema), DepartmentController.createDepartmentController)
router.get("/" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentsController)
router.get("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.getSingleDepartmentController)
router.put("/:departmentId" , parseAuthHeaderMiddleware(),validate(updateDepartmentSchema), DepartmentController.updateDepartmentController)
router.delete("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.deleteDepartmentController)
router.get("/company/tree" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentTreeController)



export default router