import type { NextFunction, Request, Response } from "express";
import { EmploymentHistoryService } from "./employmentHistory.service.js";

export class EmploymentHistoryController {
  static async createEmployeeHistoryController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
  const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Department ID",
        });
      }     
       const user = (req as any).user;
      const result = await EmploymentHistoryService.createEmploymentHistoryService(user , employeeId , req.body);
      return res.status(201).json({
        success: true,
        message: "Employee History Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getEmployeeHistoryController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
  const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Department ID",
        });
      }      const user = (req as any).user;
      const result = await EmploymentHistoryService.getEmploymentHistoryService(user , employeeId );
      return res.status(200).json({
        success: true,
        message: "Employee History Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
// static async updateEmployeeHistoryController(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) {
//     try {
//   const employeeId = req.params.employeeId;

//       if (!employeeId || Array.isArray(employeeId)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid Department ID",
//         });
//       }      const user = (req as any).user;
//       const result = await EmploymentHistoryService.updateEmploymentHistoryService(user , employeeId , req.body);
//       return res.status(201).json({
//         success: true,
//         message: "Employee History updated successfully",
//         data : result
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

}
