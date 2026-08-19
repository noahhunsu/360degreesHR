// import type { NextFunction, Request, Response } from "express";
import type { NextFunction, Request, Response } from "express";
import { SystemSettingsService } from "./system_settings.service.js";

export class SystemSettingsController {
  static async createRoleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const user = (req as any).user;
      const result = await SystemSettingsService.createRoleService(user, req.body);
      return res.status(201).json({
        success: true,
        message: "Company Role Created Successfully",
        data: result,
      });
      
    } catch (error) {
      console.log("the errror is " ,error)
      next(error);
    }
  }
  
  static async getAllRoleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await SystemSettingsService.getAllRoleService(user);
      res.status(200).json({
        success: true,
        message: "Company roles fetched Successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSingleRoleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }

      const result = await SystemSettingsService.getSingleRoleService(user , roleId);

      return res.status(200).json({
        success: true,
        message: "Single Role fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSingleRoleController(req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
          const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
        const result = await SystemSettingsService.updateSingleRoleService(user , roleId,req.body);
        return res.status(200).json(
            {
            success : true , 
            message : "Role Updated Successfully",
            data : result
        })
    } catch (error) {
        next(error)
    }

  }

  static async deleteRoleController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
        await SystemSettingsService.deleteRoleService(user , roleId)
        return res.status(200).json({
            success: true , 
            message : "Role deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
  }
  static async assignPermissionsToRoleController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {

        const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
      let permissions : string[] = req.body.permissions
       
        await SystemSettingsService.assignPermissionsToRoleService(user , roleId , permissions)
        return res.status(200).json({
            success: true , 
            message : "Permissions added to role Successfully",
        })
    } catch (error) {
        next(error)
    }
  }

  static async updatePermissionsToRoleController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
      let permissions : string[] = req.body.permissions
       
        await SystemSettingsService.assignPermissionsToRoleService(user , roleId , permissions)
        return res.status(200).json({
            success: true , 
            message : "Permissions updated on role Successfully",
        })
    } catch (error) {
        next(error)
    }
  }
  static async assignRoleToUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
      const userId = req.params.userId;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }
       
        const result = await SystemSettingsService.assignRoleToUserService(user , roleId , userId)
        return res.status(200).json({
            success: true , 
            message : "Permissions updated on role Successfully",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }
  static async deleteRoleInUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user

      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
      const userId = req.params.userId;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }
       
        await SystemSettingsService.deleteRoleInUserService(user , roleId , userId)
        return res.status(200).json({
            success: true , 
            message : "Role deleted on user Successfully",
        })
    } catch (error) {
        next(error)
    }
  }
  static async getAllRolesInUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user
      const userId = req.params.userId;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }
       
        const result = await SystemSettingsService.getAllRolesInUserService(user ,  userId)
        return res.status(200).json({
            success: true , 
            message : "Role on user fetched Successfully",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }
  static async getSingleRolesInUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const user = (req as any).user
      const userId = req.params.userId;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }
      const roleId = req.params.roleId;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
      }
       
        const result = await SystemSettingsService.getSingleRolesInUserService(user ,  roleId ,userId)
        return res.status(200).json({
            success: true , 
            message : "Single Role on user fetched Successfully",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }
  static async getPermissionsController(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
       
       
        const result = await SystemSettingsService.getSystemPermissions()
        return res.status(200).json({
            success: true , 
            message : "Single Role on user fetched Successfully",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }
}