

import type { NextFunction, Request, Response } from "express";
import { S3FilesService } from "./s3.files.service.js";

export class S3FilesController {
  static async generatePresignedUrlController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await S3FilesService.generatePresignedUrlForOnboardingService(req.body)
      return res.status(200).json({
        success: true,
        message: "Upload url generated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }



  
}
