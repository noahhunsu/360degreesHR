import type { NextFunction, Request, Response } from "express";
import { EmployeeService } from "./employee.service.js";
import { BadRequestError } from "../../shared/exceptions/app.error.js";

export class EmployeeController {
  static async createEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await EmployeeService.createEmployeeService(req.body, user);
      return res.status(201).json({
        success: true,
        message: "Employee Created successfully",
        data : result
      });
    } catch (error) {
      console.log("error is " , error)
      next(error);
    }
  }

  static async createBulkEmployeeViaSheetController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      if(!req.file){
        throw new BadRequestError("Spreadsheet file is required")
      }
      const result = await EmployeeService.createBulkEmployeeViaSheetService(req.file, user);
      return res.status(201).json({
        success: true,
        message: "Employee Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadBulkUploadTemplateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {

     const user = (req as any).user;
    const fileBuffer =
      await EmployeeService.downloadBulkUploadTemplateService(user);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employee-upload-template.xlsx",
    );

    res.setHeader("Cache-Control", "no-cache");

    return res.send(fileBuffer);

  } catch (error) {
    next(error);
  }
}
  static async getAllEmployeesController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      // normally , we'd get the pagination / filter queries and then pass it to the getAllEmployeeService

      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        name: req.query.name?.toString(),
      };

      const employeeData = await EmployeeService.getAllEmployeeService(
        user,
        query,
      );
      return res.status(200).json({
        success: true,
        message: "Employees gotten successfully",
        data: employeeData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSingleEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
 const user = (req as any).user;

      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      const employee = await EmployeeService.getSingleEmployeeService(
        user,
        employeeId,
      );

      return res.status(200).json({
        success: true,
        message: "Employee fetched successfully",
        data: employee,
      });    } catch (error) {
      next(error)
    }
  }

  static async updateEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      const updatedEmployee = await EmployeeService.updateEmployeeService(
        user,
        employeeId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: updatedEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

    static async deleteEmployeeController(
      req : Request , res : Response , next : NextFunction
    ){
      try {
        const user = (req as any).user;
        const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }
        const deletedEmployee = await EmployeeService.deleteEmployeeService(user , employeeId)
        return res.json(200).json({
          success : true  , message : "Employee Deleted Successfully ", data : deletedEmployee
        })
      } catch (error) {
        next(error)
      }
    }

      static async getAllForEmployeeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      // normally , we'd get the pagination / filter queries and then pass it to the getAllEmployeeService

      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        name: req.query.name?.toString(),
      };

      const employeeData = await EmployeeService.getAllForEmployeeService(
        user,
        query,
      );
      return res.status(200).json({
        success: true,
        message: "Employees gotten successfully",
        data: employeeData,
      });
    } catch (error) {
      next(error);
    }
  }

}
