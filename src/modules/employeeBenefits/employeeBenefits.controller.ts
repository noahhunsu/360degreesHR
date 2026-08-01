import type { NextFunction, Request, Response } from "express";
import { PayrollComponentManagementService } from "./employeeBenefits.service.js";

export class PayrollComponentManagementController {
  static async createPayrollComponentController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result =
        await PayrollComponentManagementService.createPayrollComponentService(
          user,
          req.body,
        );
      return res.status(201).json({
        success: true,
        message: "Payroll Component created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updatePayrollComponentController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const payrollComponentId = req.params.payrollComponentId;

      if (!payrollComponentId || Array.isArray(payrollComponentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll component ID",
        });
      }
      const result =
        await PayrollComponentManagementService.updatePayrollComponentService(
          user,
          payrollComponentId,
          req.body,
        );
      return res.status(200).json({
        success: true,
        message: "Payroll component updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deletePayrollComponentServiceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollComponentId = req.params.payrollComponentId;

      if (!payrollComponentId || Array.isArray(payrollComponentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll component ID",
        });
      }
      const result = await PayrollComponentManagementService.deletePayrollComponentServiceService(
        user,
        payrollComponentId,
      );
      return res.status(200).json({
        success: true,
        message: "Salary component updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSinglePayrollComponentController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollComponentId = req.params.payrollComponentId;

      if (!payrollComponentId || Array.isArray(payrollComponentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll component ID",
        });
      }
      const result = await PayrollComponentManagementService.getSinglePayrollComponentService(
        user,
        payrollComponentId,
      );
      return res.status(200).json({
        success: true,
        message: " Payroll component fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

static async getAllPayrollComponentsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = (req as any).user;
    
    // Get pagination parameters from query string
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search as string | undefined;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be at least 1",
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    // Call the service
    const result = await PayrollComponentManagementService.getAllPayrollComponentsService(
      user,
      page,
      limit,
      search,
    );

    return res.status(200).json({
      success: true,
      message: "Salary components retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

  static async getEmployeeComponentController(
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
          message: "Invalid employeeId ID",
        });
      }

      const result = await PayrollComponentManagementService.getEmployeeComponentService(
        user,
        employeeId
      );
      return res.status(201).json({
        success: true,
        message: " employee component fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async attachComponentController(
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

      const result = await PayrollComponentManagementService.attachComponentService(
        user,
        employeeId,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: " Employee benefit attached successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateEmployeeComponentsController(
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
          message: "Invalid employee Id ID",
        });
      }

      const result = await PayrollComponentManagementService.updateEmployeeComponentsService(
        user,
        employeeId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: " Employee Benefit rejected successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeEmployeeComponentsController(
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
          message: "Invalid employee  ID",
        });
      }

      const result = await PayrollComponentManagementService.removeEmployeeComponentsService(
        user,
        employeeId , req.body
      );
      return res.status(200).json({
        success: true,
        message: " Benefits removed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }


  static async runPayrollForMonthController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = (req as any).user;
    const result = await PayrollComponentManagementService.runPayrollForMonthService(user, req.body)
    return res.status(200).json({
      success : true, 
      message : "Payroll Run Successfully",
      data : result
    })
   
  } catch (error) {
    next(error);
  }
}
  static async lockPayrollController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollId = req.params.payrollId;

      if (!payrollId || Array.isArray(payrollId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Payroll  ID",
        });
      }

      const result = await PayrollComponentManagementService.lockPayrollService(
        user,
        payrollId 
      );
      return res.status(200).json({
        success: true,
        message: "payroll locked successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async markPayrollAsPaidController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollId = req.params.payrollId;

      if (!payrollId || Array.isArray(payrollId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Payroll  ID",
        });
      }

      const result = await PayrollComponentManagementService.markPayrollAsPaidService(
        user,
        payrollId 
      );
      return res.status(200).json({
        success: true,
        message: "payroll marked as paid successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async editPayrollSnapshotController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const breakdownId = req.params.breakdownId;

      if (!breakdownId || Array.isArray(breakdownId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid breakdown  ID",
        });
      }

      const result = await PayrollComponentManagementService.editPayrollSnapshotService(
        user,
        breakdownId , req.body
      );
      return res.status(200).json({
        success: true,
        message: "Breakdown edited successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async addPayrollBreakdownController(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const user = (req as any).user;
  //     const payrollItemId = req.params.payrollItemId;

  //     if (!payrollItemId || Array.isArray(payrollItemId)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid payroll item  ID",
  //       });
  //     }

  //     const result = await PayrollComponentManagementService.addPayrollBreakdownService(
  //       user,
  //       payrollItemId , req.body
  //     );
  //     return res.status(200).json({
  //       success: true,
  //       message: "Payroll item  edited successfully",
  //       data: result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async removePayrollBreakdownController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollItemId = req.params.payrollItemId;

      if (!payrollItemId || Array.isArray(payrollItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll item  ID",
        });
      }

      const result = await PayrollComponentManagementService.removePayrollBreakdownService(
        user,
        payrollItemId , req.body
      );
      return res.status(200).json({
        success: true,
        message: "Payroll item  removed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
 
  static async getAllPayrollRunsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
    

      const result = await PayrollComponentManagementService.getAllPayrollRunsService(
        user,
       
      );
      return res.status(200).json({
        success: true,
        message: "Payroll runs fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getSinglePayrollRunsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const payrollId = req.params.payrollId;

      if (!payrollId || Array.isArray(payrollId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll  ID",
        });
      }

      const result = await PayrollComponentManagementService.getSinglePayrollRunsService(
        user,
        payrollId 
      );
      return res.status(200).json({
        success: true,
        message: "Single Payroll fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getAllEmployeePayrollItemController(
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
          message: "Invalid employee  ID",
        });
      }

      const result = await PayrollComponentManagementService.getAllEmployeePayrollItemService(
        user,
        employeeId 
      );
      return res.status(200).json({
        success: true,
        message: "All employee payroll fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getSingleEmployeePayrollItemController(
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
          message: "Invalid employee  ID",
        });
      }
      const payrollItemId = req.params.payrollItemId;

      if (!payrollItemId || Array.isArray(payrollItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payrollItem  ID",
        });
      }

      const result = await PayrollComponentManagementService.getSingleEmployeePayrollItemService(
        user,
        employeeId  , 
        payrollItemId
      );
      return res.status(200).json({
        success: true,
        message: "Single Employee payroll item fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getPayrollSummaryController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const payrollRunId = req.params.payrollRunId;

      if (!payrollRunId || Array.isArray(payrollRunId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payrollRun  ID",
        });
      }

      const result = await PayrollComponentManagementService.getPayrollSummaryService(
        user,

        payrollRunId
      );
      return res.status(200).json({
        success: true,
        message: "Single Employee payroll item fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async deletePayrollRunController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const payrollRunId = req.params.payrollRunId;

      if (!payrollRunId || Array.isArray(payrollRunId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payrollRun  ID",
        });
      }

      const result = await PayrollComponentManagementService.deletePayrollRunService(
        user,

        payrollRunId
      );
      return res.status(200).json({
        success: true,
        message: "Payroll run deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getEmployeePayrollHistoryController(
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
          message: "Invalid employee  ID",
        });
      }

      const result = await PayrollComponentManagementService.getEmployeePayrollHistoryService(
        user,
        employeeId
      );
      return res.status(200).json({
        success: true,
        message: "Pay successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
   static async getMyPayslipController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const payrollItemId = req.params.payrollItemId;

      if (!payrollItemId || Array.isArray(payrollItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payroll item  ID",
        });
      }

      const result = await PayrollComponentManagementService.getMyPayslipService(
        user,

        payrollItemId
      );
      return res.status(200).json({
        success: true,
        message: "Payslip fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }



}