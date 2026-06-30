import type { NextFunction, Request, Response } from "express";
import { JobOpeningCreationService } from "./jobCreation.service.js";

export class JobOpeningCreationController {
  static async createJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await JobOpeningCreationService.createJobOpeningService(req.body , user)
      return res.status(201).json({
        success: true,
        message: "Job opening Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  
 static async getAllJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      
      const user = (req as any).user;
      
      const result = await JobOpeningCreationService.getAllJobOpeningService(user)
      return res.status(200).json({
        success: true,
        message: "Job requisition fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getSingleJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      
      const user = (req as any).user;
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.getSingleJobOpeningService(user , jobOpeningId)
      return res.status(200).json({
        success: true,
        message: "Job requisition fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.updateJobOpeningService(jobOpeningId , req.body , user)

      return res.status(200).json({
        success: true,
        message: "Job opening updated successfully",
        data : result
      });
    } catch (error) {
      console.log("The error is " , error);
      next(error);
    }
  }
  static async publishJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.publishJobOpeningService(jobOpeningId ,user)
      return res.status(200).json({
        success: true,
        message: "Job opening published successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async closeJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.closeJobOpeningService(jobOpeningId ,user)
      return res.status(200).json({
        success: true,
        message: "Job opening closed successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async reOpenJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.reOpenJobOpeningService(jobOpeningId ,user)
      return res.status(200).json({
        success: true,
        message: "Job opening reopened successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getJobOpeningStatsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      
    
      const result = await JobOpeningCreationService.getJobOpeningStats(user)
      return res.status(200).json({
        success: true,
        message: "Job openings stats fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getPublishedJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      
     const companyId = req.params.companyId;

      if (!companyId || Array.isArray(companyId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID",
        });
      }
     
      const result = await JobOpeningCreationService.getPublishedJobOpeningService(companyId )
      return res.status(200).json({
        success: true,
        message: "Single Published Job openings fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSinglePublishedJobOpeningController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      
     const companyId = req.params.companyId;

      if (!companyId || Array.isArray(companyId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID",
        });
      }
     const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobOpeningCreationService.getSinglePublishedJobOpeningService(companyId , jobOpeningId)
      return res.status(200).json({
        success: true,
        message: "Single Published Job openings fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  
 
  

  
}
