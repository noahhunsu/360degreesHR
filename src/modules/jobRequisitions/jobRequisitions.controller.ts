import type { NextFunction, Request, Response } from "express";
import { JobRequisitionService } from "./jobRequisitions.service.js";

export class JobRequisitionController {
  static async createJobRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await JobRequisitionService.createJobRequisitionService(req.body , user)
      return res.status(201).json({
        success: true,
        message: "Job requisition Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getAllRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await JobRequisitionService.getAllRequisitionService(user)
      return res.status(201).json({
        success: true,
        message: "Job requisitions fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  
  static async getSingleJobRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      
      const requisitionId = req.params.requisitionId;

      if (!requisitionId || Array.isArray(requisitionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid requisition ID",
        });
      }
      const result = await JobRequisitionService.getSingleRequisitionService(requisitionId,user )
      return res.status(200).json({
        success: true,
        message: "Job requisition fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateJobRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      
      const requisitionId = req.params.requisitionId;

      if (!requisitionId || Array.isArray(requisitionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid requisition ID",
        });
      }
      const result = await JobRequisitionService.updateJobRequisitionService(requisitionId,req.body , user )
      return res.status(200).json({
        success: true,
        message: "Job requisition updated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelJobRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      
      const requisitionId = req.params.requisitionId;

      if (!requisitionId || Array.isArray(requisitionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid requisition ID",
        });
      }
      const result = await JobRequisitionService.cancelJobRequisitionService(requisitionId, user )
      return res.status(200).json({
        success: true,
        message: "Job requisition deleted successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async acceptOrRejectRequisitionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      
      const requisitionId = req.params.requisitionId;

      if (!requisitionId || Array.isArray(requisitionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid requisition ID",
        });
      }
      const result = await JobRequisitionService.acceptOrRejectRequisitionService(requisitionId, user ,req.body)
      return res.status(200).json({
        success: true,
        message: "Job requisition updated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getJobRequisitionStatsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;

      
      const result = await JobRequisitionService.getJobRequisitionStatsService(user )
      return res.status(200).json({
        success: true,
        message: "Job requisitions stat gotten successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  
 
  

  
}
