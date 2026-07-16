import type { NextFunction, Request, Response } from "express";
import { LoansAndAdvanceService } from "./companyDebts.service.js";

export class LoansAndAdvanceController {
  static async createSalaryAdvanceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await LoansAndAdvanceService.createSalaryAdvanceService(
        user,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: "Advance Created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateSalaryAdvanceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const salaryAdvanceId = req.params.salaryAdvanceId;

      if (!salaryAdvanceId || Array.isArray(salaryAdvanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Advance ID",
        });
      }
      const result = await LoansAndAdvanceService.updateSalaryAdvanceService(
        user,
        salaryAdvanceId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: "Salary Advance updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async cancelSalaryAdvanceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const salaryAdvanceId = req.params.salaryAdvanceId;

      if (!salaryAdvanceId || Array.isArray(salaryAdvanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Advance ID",
        });
      }
      const result = await LoansAndAdvanceService.updateSalaryAdvanceService(
        user,
        salaryAdvanceId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: "Salary Advance canceled successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllSalaryAdvanceRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result =
        await LoansAndAdvanceService.getAllSalaryAdvanceRequestService(user);
      return res.status(200).json({
        success: true,
        message: "Salary advance fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSingleSalaryAdvanceRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const salaryAdvanceId = req.params.salaryAdvanceId;

      if (!salaryAdvanceId || Array.isArray(salaryAdvanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Advance ID",
        });
      }
      const result = await LoansAndAdvanceService.getSingleSalaryAdvanceRequestService(
        user, salaryAdvanceId
      );
      return res.status(200).json({
        success: true,
        message: "Salary advance fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async approveOrRejectSalaryAdvanceRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const salaryAdvanceId = req.params.salaryAdvanceId;

      if (!salaryAdvanceId || Array.isArray(salaryAdvanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Advance ID",
        });
      }
      const result = await LoansAndAdvanceService.approveOrRejectSalaryAdvanceRequestService(
        user, salaryAdvanceId , req.body
      );
      return res.status(200).json({
        success: true,
        message: "Salary advance updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async confirmPaidSalaryAdvanceRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const salaryAdvanceId = req.params.salaryAdvanceId;

      if (!salaryAdvanceId || Array.isArray(salaryAdvanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Advance ID",
        });
      }
      const result = await LoansAndAdvanceService.confirmPaidSalaryAdvanceRequestService(
        user, salaryAdvanceId , req.body
      );
      return res.status(200).json({
        success: true,
        message: "Salary advance paid successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }


  // static async confirmPaidSalaryAdvanceRequestController(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const result =
  //       await JobApplicationService.generatePresignedUrlApplicationService(
  //         req.body,
  //       );
  //     return res.status(200).json({
  //       success: true,
  //       message: "Upload url generated successfully",
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log("the error is ", error);
  //     next(error);
  //   }
  // }

  // static async applicationSubmissionDocumentViewController(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const user = (req as any).user;
  //     const applicationId = req.params.applicationId as string;
  //     const documentId = req.params.documentId as string;
  //     const result =
  //       await JobApplicationService.applicationSubmissionDocumentViewService(
  //         applicationId,
  //         documentId,
  //         user,
  //       );

  //     return res.status(200).json({
  //       success: true,
  //       message: "Submission Document fetched successfully",
  //       data: result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
