import type { NextFunction, Request, Response } from "express";
import { LeaveManagementService } from "./leaveApplication.service.js";

export class LeaveManagementController {
  static async createLeaveTypeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.createLeaveTypeService(
        req.body,
        user,
      );
      return res.status(201).json({
        success: true,
        message: "Leave Type Created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllLeaveTypeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.getAllLeaveTypeService(user);
      return res.status(200).json({
        success: true,
        message: "Leave Types Fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSingleLeaveTypeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveTypeId = req.params.leaveTypeId;

      if (!leaveTypeId || Array.isArray(leaveTypeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leaveType ID",
        });
      }
      const result = await LeaveManagementService.getSingleLeaveTypeService(
        leaveTypeId,
        user,
      );
      return res.status(200).json({
        success: true,
        message: "Single Leave Type Fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateLeaveTypeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveTypeId = req.params.leaveTypeId;

      if (!leaveTypeId || Array.isArray(leaveTypeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leaveType ID",
        });
      }
      const result = await LeaveManagementService.updateLeaveTypeService(
        user,
        leaveTypeId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: " Leave Type updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createOrUpdateEmployeeLeaveBalanceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveTypeId = req.params.leaveTypeId;
      const employeeId = req.params.employeeId;

      if (!leaveTypeId || Array.isArray(leaveTypeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leaveType ID",
        });
      }

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Employee ID",
        });
      }

      const payload = {
        
        ...req.body,
      };
      const result =
        await LeaveManagementService.createOrUpdateEmployeeLeaveBalanceService(
          user,
          employeeId , leaveTypeId,
          payload
        );
      return res.status(200).json({
        success: true,
        message: " Employee Leave balance updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async createLeaveRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveTypeId = req.params.leaveTypeId;

      if (!leaveTypeId || Array.isArray(leaveTypeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leaveType ID",
        });
      }

      const result = await LeaveManagementService.createLeaveRequestService(
        user,
        leaveTypeId,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: " Leave Request Created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async cancelLeaveRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveRequestId = req.params.leaveRequestId;

      if (!leaveRequestId || Array.isArray(leaveRequestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave Request ID",
        });
      }

      const result = await LeaveManagementService.cancelLeaveRequestService(
        user,
        leaveRequestId,
      );
      return res.status(200).json({
        success: true,
        message: " Leave Request Canceled successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async rejectLeaveRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveRequestId = req.params.leaveRequestId;

      if (!leaveRequestId || Array.isArray(leaveRequestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave Request ID",
        });
      }

      const result = await LeaveManagementService.rejectLeaveRequestService(
        user,
        leaveRequestId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: " Leave Request rejected successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveLeaveRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveRequestId = req.params.leaveRequestId;

      if (!leaveRequestId || Array.isArray(leaveRequestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave Request ID",
        });
      }

      const result = await LeaveManagementService.approveLeaveRequestService(
        user,
        leaveRequestId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: " Leave Request approved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeavePolicyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.getLeavePolicyService(user);
      return res.status(200).json({
        success: true,
        message: " Leave Policy fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createLeavePolicyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.createLeavePolicyService(
        user,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: " Leave Policy created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllLeaveController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.getAllLeaveRequestService(
        user
      );
      return res.status(201).json({
        success: true,
        message: " Leave requests fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateLeavePolicyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.updateLeavePolicyService(user , req.body)
      return res.status(200).json({
        success: true,
        message: " Leave Policy updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async createPublicHolidayController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.createPublicHolidayService(
        user,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: " Public Holiday created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllPublicHolidaysController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const result = await LeaveManagementService.getAllPublicHolidaysService(
        user
      );
      return res.status(201).json({
        success: true,
        message: " Public Holiday created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSinglePublicHolidaysController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      const holidayId = req.params.holidayId;
       if (!holidayId || Array.isArray(holidayId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }

      const result = await LeaveManagementService.getSinglePublicHolidaysService(
        user, holidayId
      );
      return res.status(201).json({
        success: true,
        message: " Public Holiday created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async updatePublicHolidayController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const holidayId = req.params.holidayId;

      if (!holidayId || Array.isArray(holidayId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }
      const result = await LeaveManagementService.updatePublicHolidayService(
        user,
        holidayId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: " Public Holiday updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deletePublicHolidayController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const holidayId = req.params.holidayId;

      if (!holidayId || Array.isArray(holidayId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }
      const result = await LeaveManagementService.deletePublicHolidayService(
        user,
        holidayId,
      );
      return res.status(200).json({
        success: true,
        message: " Public Holiday deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generatePresignedUrlLeaveApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result =
        await LeaveManagementService.generatePresignedUrlApplicationService(
          user,
          req.body
        );
      return res.status(200).json({
        success: true,
        message: "Upload url generated successfully",
        data: result,
      });
    } catch (error) {
      console.log("the error is ", error);
      next(error);
    }
  }

  static async leaveApplicationSubmissionDocumentViewController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const leaveRequestId = req.params.leaveRequestId as string;
      const documentId = req.params.documentId as string;
      const result =
        await LeaveManagementService.leaveApplicationSubmissionDocumentViewService(
          leaveRequestId,
          documentId,
          user,
        );

      return res.status(200).json({
        success: true,
        message: "Submission Document fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
