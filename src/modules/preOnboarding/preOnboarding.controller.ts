import type { NextFunction, Request, Response } from "express";
import { preOnboardingService } from "./preOnboarding.service.js";
import type { User } from "@prisma/client";

export class PreOnboardingController {
  static async getAllInvitationsService(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await preOnboardingService.getAllInvitationsService(user)
      return res.status(201).json({
        success: true,
        message: "Onboarding Invitations fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async createOnboardingInvitationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await preOnboardingService.createOnboardingInvitationService(req.body , req.file , user)
      return res.status(201).json({
        success: true,
        message: "Onboarding Invitation Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getOnboardingInvitationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.query.token as string;
      const result = await preOnboardingService.getOnboardingInvitationService(token)
      return res.status(200).json({
        success: true,
        message: "Onboarding Invitation fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async submitOnboardingDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await preOnboardingService.saveOnboardingSubmissionService(req.body )
      return res.status(201).json({
        success: true,
        message: "Submission successful",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllSubmissionsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const hrUser = (req as any).user
      const result = await preOnboardingService.getOnboardingSubmissionService(hrUser )
      return res.status(200).json({
        success: true,
        message: "Submissions fetched successful",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getSingleSubmissionsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const hrUser = (req as any).user;
      const submissionId = req.params.submissionId as string;
      const result = await preOnboardingService.getSingleOnboardingSubmissionService(hrUser, submissionId )
      return res.status(200).json({
        success: true,
        message: "Submissions fetched successful",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async onboardingSubmissionActionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const hrUser = (req as any).user;
      const submissionId = req.params.submissionId as string;
      const result = await preOnboardingService.onboardingSubmissionActionService(submissionId,hrUser, req.body )
      
      return res.status(200).json({
        success: true,
        message: "Submissions updated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async onboardingSubmissionDocumentViewController(
    req: Request,
    res: Response,
    next: NextFunction,
  ){

    try {
      const hrUser = (req as any).user;
      const submissionId = req.params.submissionId as string;
      const documentId = req.params.documentId as string;
      const result = await preOnboardingService.onboardingSubmissionDocumentViewService(submissionId, documentId ,hrUser)
      
      return res.status(200).json({
        success: true,
        message: "Submission Document fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async generatePresignedUrlForPreOnboardingController(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
try{
    
          const result = await preOnboardingService.generatePresignedUrlPreOnboardingService(req.body)
          console.log("request body is " , req.body)
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


  
}
