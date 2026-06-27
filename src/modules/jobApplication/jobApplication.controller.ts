import type { NextFunction, Request, Response } from "express";
import { JobApplicationService, } from "./jobApplication.service.js";

export class JobApplicationController {
  static async createJobApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jobOpeningId = req.params.jobOpeningId;

      if (!jobOpeningId || Array.isArray(jobOpeningId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobApplicationService.createJobApplicationService(req.body , jobOpeningId)
      return res.status(201).json({
        success: true,
        message: "Application Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllJobApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
     
      const result = await JobApplicationService.getAllJobApplicationService(user)
      return res.status(201).json({
        success: true,
        message: "Job applications fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSingleJobApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const applicationId = req.params.applicationId;

      if (!applicationId || Array.isArray(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid jobOpening ID",
        });
      }
      const result = await JobApplicationService.getSingleJobApplicationService(user , applicationId)
      return res.status(201).json({
        success: true,
        message: "Job application fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async moveJobApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const applicationId = req.params.applicationId;

      const payload = {
        ...req.body , applicationId
      }

      const result = await JobApplicationService.moveJobApplicationService(user , payload)
      return res.status(200).json({
        success: true,
        message: "Job application updated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async rejectJobApplicationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const applicationId = req.params.applicationId;

      const payload = {
        ...req.body , applicationId
      }

      const result = await JobApplicationService.rejectJobApplicationService(user , payload)
      return res.status(200).json({
        success: true,
        message: "Job application updated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async generatePresignedUrlApplicationController(
      req: Request,
      res: Response,
      next: NextFunction,
    ){
  try{
      
            const result = await JobApplicationService.generatePresignedUrlApplicationService(req.body)
            return res.status(200).json({
              success: true,
              message: "Upload url generated successfully",
              data : result
            });
          } catch (error) {
            console.log("the error is " , error)
            next(error);
          }
    }
 
     static async applicationSubmissionDocumentViewController(
        req: Request,
        res: Response,
        next: NextFunction,
      ){
    
        try {
          const user = (req as any).user;
          const applicationId = req.params.applicationId as string;
          const documentId = req.params.documentId as string;
          const result = await JobApplicationService.applicationSubmissionDocumentViewService(applicationId, documentId ,user)
          
          return res.status(200).json({
            success: true,
            message: "Submission Document fetched successfully",
            data : result
          });
        } catch (error) {
          next(error);
        }
      }
 

  
 
  

  
}
