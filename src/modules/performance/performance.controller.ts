// import type { NextFunction, Request, Response } from "express";
import type { NextFunction, Request, Response } from "express";
import { PerformanceService } from "./performance.service.js";

export class PerformanceController {
  static async createPerformanceTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await PerformanceService.createPerformanceTemplateService(
        user,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: "Performance Template created  Successfully",
        data: result,
      });
    } catch (error) {
      console.log("the errror is ", error);
      next(error);
    }
  }

  static async updatePerformanceTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template ID",
        });
      }
      const result = await PerformanceService.updatePerformanceTemplateService(
        user,
        templateId,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: "Template Updated Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPerformanceTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      console.log("The user is " , user);
      const result =
        await PerformanceService.getAllPerformanceTemplateService(user);

      return res.status(200).json({
        success: true,
        message: "All templates fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSinglePerformanceTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template ID",
        });
      }
      const result =
        await PerformanceService.getSinglePerformanceTemplateService(
          user,
          templateId,
        );
      return res.status(200).json({
        success: true,
        message: "Single template fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSinglePerformanceTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
     const user = (req as any).user;
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid template ID",
        });
      }
      await PerformanceService.deleteSinglePerformanceTemplateService(user,templateId);
      return res.status(200).json({
        success: true,
        message: "Template deleted Successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  static async createPerformanceReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await PerformanceService.createPerformanceReviewService(user , req.body);
      return res.status(201).json({
        success: true,
        message: "Performance review created Successfully",
        data : result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyReviewsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
     
      const user = (req as any).user;
      const result =await PerformanceService.getMyReviewsService(user);
      return res.status(200).json({
        success: true,
        message: "My reviews fetched successfully Successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getMyReviewTasksController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
     
      const user = (req as any).user;
      const result =await PerformanceService.getMyReviewTasksService(user);
      return res.status(200).json({
        success: true,
        message: "My review tasks fetched successfully Successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllReviewInstancesController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
     
      const user = (req as any).user;
      const result =await PerformanceService.getAllReviewInstancesService(user);
      return res.status(200).json({
        success: true,
        message: "All review instances fetched successfully Successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

   static async closePerformanceReviewController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const reviewId = req.params.reviewId;

      if (!reviewId || Array.isArray(reviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }
      const result = await PerformanceService.closePerformanceReviewService(
        user,
        reviewId,
      );
      res.status(200).json({
        success: true,
        message: "Performance review Closed Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
