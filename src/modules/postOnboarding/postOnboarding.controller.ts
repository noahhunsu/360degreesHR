import type { NextFunction, Request, Response } from "express";
import { postOnboardingService } from "./postOnboarding.service.js";

export class PostOnboardingController {
  static async createOnboardingTaskTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result =
        await postOnboardingService.createOnboardingTaskTemplateService(
          req.body,
          user,
        );
      return res.status(201).json({
        success: true,
        message: "Onboarding Task Template Created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOnboardingTaskTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result =
        await postOnboardingService.getOnboardingTaskTemplatesService(user);
      return res.status(200).json({
        success: true,
        message: "Onboarding Task Template fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deactivateOnboardingTaskTemplateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const templateId = req.params.templateId;

      if (!templateId || Array.isArray(templateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Template ID",
        });
      }
      const user = (req as any).user;
      const result =
        await postOnboardingService.deactivateOnboardingTaskTemplateService(
          templateId,
          user,
        );
      return res.status(200).json({
        success: true,
        message: "Onboarding Task Template deactivated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async createOnboardingTaskController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Employee ID",
        });
      }
      const user = (req as any).user;
      const result = await postOnboardingService.createOnboardingTaskService(
        employeeId,
        user,
        req.body,
      );
      return res.status(201).json({
        success: true,
        message: "Onboarding Task created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getMyOnboardingTaskController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result =
        await postOnboardingService.getMyOnboardingTaskService(user);
      return res.status(200).json({
        success: true,
        message: "Onboarding Task gotten successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async startMyOnboardingTaskController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const taskId = req.params.taskId;

      if (!taskId || Array.isArray(taskId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID",
        });
      }
      const user = (req as any).user;
      const result = await postOnboardingService.startMyOnboardingTaskService(
        taskId,
        user,
      );
      return res.status(200).json({
        success: true,
        message: "Onboarding Task created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async completeMyOnboardingTaskController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const taskId = req.params.taskId;

      if (!taskId || Array.isArray(taskId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID",
        });
      }
      const user = (req as any).user;
      const result =
        await postOnboardingService.completeMyOnboardingTaskService(
          taskId,
          user,
        );
      return res.status(200).json({
        success: true,
        message: "Onboarding Task completed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getIncompleteOnboardingTaskController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const employeeId = req.params.employeeId;

      if (!employeeId || Array.isArray(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Employee ID",
        });
      }
      const user = (req as any).user;
      const result =
        await postOnboardingService.getIncompleteOnboardingTaskService(
          user,
          employeeId,
        );
      return res.status(200).json({
        success: true,
        message: "Incomplete Onboarding Tasks fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
