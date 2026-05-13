import type { NextFunction, Request, Response } from "express";
import { DepartmentService } from "./department.service.js";

export class DepartmentController {
  static async createDepartmentController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await DepartmentService.createDepartmentService(req.body, user);
      return res.status(201).json({
        success: true,
        message: "Department Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getDepartmentsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const departments = await DepartmentService.getDepartmentsService(user);
      return res.status(200).json({
        success: true,
        message: "Departments fetched successfully",
        data : departments
      });
    } catch (error) {
      next(error);
    }
  }
 
  static async getSingleDepartmentController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const departmentId = req.params.departmentId;

      if (!departmentId || Array.isArray(departmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Department ID",
        });
      }
      const user = (req as any).user;
      const department = await DepartmentService.getSingleDepartmentService(user , departmentId);
      return res.status(200).json({
        success: true,
        message: "Department fetched successfully",
        data : department
      });
    } catch (error) {
      next(error);
    }
    }
  static async updateDepartmentController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const departmentId = req.params.departmentId;

      if (!departmentId || Array.isArray(departmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Department ID",
        });
      }
      const user = (req as any).user;
      const updatedDepartment = await DepartmentService.updateDepartmentService(user , departmentId , req.body);
      return res.status(200).json({
        success: true,
        message: "Department Updated successfully",
        data : updatedDepartment
      });
    } catch (error) {
      next(error);
    }
    }
  static async deleteDepartmentController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const departmentId = req.params.departmentId;

      if (!departmentId || Array.isArray(departmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Department ID",
        });
      }
      const user = (req as any).user;
      const updatedDepartment = await DepartmentService.deleteDepartmentService(user , departmentId );
      return res.status(200).json({
        success: true,
        message: "Department Updated successfully",
        data : updatedDepartment
      });
    } catch (error) {
      next(error);
    }
    }
  static async getDepartmentTreeController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const user = (req as any).user;
      const departmentTree = await DepartmentService.getDepartmentTreeService(user );
      return res.status(200).json({
        success: true,
        message: "Department Tree fetched  successfully",
        data : departmentTree
      });
    } catch (error) {
      next(error);
    }
    }
}
