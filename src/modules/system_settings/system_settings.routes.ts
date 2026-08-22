import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { SystemSettingsController } from "./system_settings.controller.js";
import { createRoleSchema, permissionToRoleSchema, updateRoleSchema } from "./system_settings.validation.js";
import { parseAuthHeaderMiddleware, parseAuthorizationMiddleware, requiredPermission } from "../../shared/middleware/auth.middleware.js";


const router = Router()

router.post("/create" ,parseAuthHeaderMiddleware()  , validate(createRoleSchema), SystemSettingsController.createRoleController)
router.get("/" , parseAuthHeaderMiddleware() ,SystemSettingsController.getAllRoleController)
router.get("/system/permissions" ,requiredPermission(["view_permission"]) , SystemSettingsController.getPermissionsController)
router.get("/:roleId" , parseAuthHeaderMiddleware() , SystemSettingsController.getSingleRoleController)
router.patch("/:roleId" , parseAuthHeaderMiddleware() ,  validate(updateRoleSchema), SystemSettingsController.updateSingleRoleController)
router.delete("/:roleId" , parseAuthHeaderMiddleware() ,SystemSettingsController.deleteRoleController)
router.post("/:roleId/assign-permissions" , parseAuthHeaderMiddleware() , validate(permissionToRoleSchema),SystemSettingsController.assignPermissionsToRoleController)
router.patch("/:roleId/update-permissions" , parseAuthHeaderMiddleware() , validate(permissionToRoleSchema),SystemSettingsController.updatePermissionsToRoleController)
router.post("/:roleId/assign-role/:userId" , parseAuthHeaderMiddleware() ,SystemSettingsController.assignRoleToUserController)
router.patch("/:roleId/remove-role/:userId" , parseAuthHeaderMiddleware() ,SystemSettingsController.deleteRoleInUserController)
router.get("/:userId/user-role" , parseAuthHeaderMiddleware() ,SystemSettingsController.getAllRolesInUserController)
router.get("/:userId/user-role/:roleId" , parseAuthHeaderMiddleware() ,SystemSettingsController.getSingleRolesInUserController)

export default router