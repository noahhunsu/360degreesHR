import type { NextFunction, Request, Response } from "express";
import { DisciplinaryService } from "./disciplinary.service.js";

export class DisciplinaryController {
  static async createDisciplinaryRecordController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }
      const user = (req as any).user;
      const result = await DisciplinaryService.createDisciplinaryRecordService(
        user,
        employeeId,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: "Disciplinary Record Created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDisciplinaryRecordController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Employee ID",
        });
      }
      const user = (req as any).user;
      const result = await DisciplinaryService.getDisciplinaryRecordService(
        user,
        employeeId,
      );
      return res.status(200).json({
        success: true,
        message: "Disciplinary Record Fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async resolveDisciplinaryRecordController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const disciplinaryId = req.params.disciplinaryId;

      if (!disciplinaryId || Array.isArray(disciplinaryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Disciplinary ID",
        });
      }
      const user = (req as any).user;
      const result = await DisciplinaryService.resolveDisciplinaryRecordService(
        user,
        disciplinaryId,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: "Disciplinary Record Resolved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
