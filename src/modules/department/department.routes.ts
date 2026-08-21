import { Router } from "express";
import { DepartmentController } from "./department.controller.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation.js";
import { parseAuthHeaderMiddleware, parseAuthorizationMiddleware, requiredPermission } from "../../shared/middleware/auth.middleware.js";




const router = Router()
router.post("/" , parseAuthHeaderMiddleware(), parseAuthorizationMiddleware() , requiredPermission(["create_department"]),validate(createDepartmentSchema), DepartmentController.createDepartmentController)
router.get("/" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentsController)
router.get("/:departmentId" , parseAuthHeaderMiddleware(), DepartmentController.getSingleDepartmentController)
router.put("/:departmentId" , parseAuthHeaderMiddleware(), requiredPermission(["update_department"]),validate(updateDepartmentSchema), DepartmentController.updateDepartmentController)
router.delete("/:departmentId" , parseAuthHeaderMiddleware(), requiredPermission(["delete_department"]), DepartmentController.deleteDepartmentController)
router.get("/company/tree" , parseAuthHeaderMiddleware(), DepartmentController.getDepartmentTreeController)



export default router