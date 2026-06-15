import type { NextFunction, Request, Response } from "express";
import { OnboardingTemplateService } from "./onboardingTemplate.service.js";

export class OnboardingTemplateController {
  static async createOnboardingTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await OnboardingTemplateService.createOnboardingTemplateService(req.body, user);
      return res.status(201).json({
        success: true,
        message: "Template Created successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOnboardingTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const templates = await OnboardingTemplateService.getOnboardingTemplateService(user);
      return res.status(200).json({
        success: true,
        message: "Onboarding Templates fetched successfully",
        data : templates
      });
    } catch (error) {
      next(error);
    }
  }
 
  static async getSingleOnboardingTemplateController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template ID",
        });
      }
      const user = (req as any).user;
      const template = await OnboardingTemplateService.getSingleOnboardingTemplateService(user , templateId);
      return res.status(200).json({
        success: true,
        message: "Template fetched successfully",
        data : template
      });
    } catch (error) {
      next(error);
    }
    }
  static async updateOnboardingTemplateController(  req: Request,
    res: Response,
    next: NextFunction
  ){

      try {
        
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template ID",
        });
      }
      const user = (req as any).user;
      const updatedtemplate = await OnboardingTemplateService.updateOnboardingTemplateService(user , templateId , req.body);
      return res.status(200).json({
        success: true,
        message: "Template Updated successfully",
        data : updatedtemplate
      });
    } catch (error) {
      next(error);
    }
    }
  static async deleteOnboardingTemplateController(  req: Request,
    res: Response,
    next: NextFunction,){

      try {
        
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Template ID",
        });
      }
      const user = (req as any).user;
      const updatedTemplate = await OnboardingTemplateService.deleteOnboardingTemplateService(user , templateId );
      return res.status(200).json({
        success: true,
        message: "Template Deleted successfully",
        data : updatedTemplate
      });
    } catch (error) {
      next(error);
    }
    }
  
}
