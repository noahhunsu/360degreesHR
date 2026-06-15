

import type { NextFunction, Request, Response } from "express";
import { OfferLetterService } from "./offer_letter.service.js";

export class OfferLetterController {

  static async generatePresignedUrlForOfferController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await OfferLetterService.generatePresignedUrlOfferLetterTemplateService(user , req.body)
      return res.status(200).json({
        success: true,
        message: "Upload url generated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async generatePresignedUrlForEmployeeOfferController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const result = await OfferLetterService.generatePresignedUrlForEmployeeOfferService(user , req.body)
      return res.status(200).json({
        success: true,
        message: "Upload url generated successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadOfferLetterController(
      req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const user = (req as any).user;
      const result = await OfferLetterService.uploadOfferLetterService(user , req.body)
      return res.status(201).json({
        success: true,
        message: "Offer Letter Template uploaded successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }
  static async getOfferLetterController(
      req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const user = (req as any).user;
      // const result = await OfferLetterService.uploadOfferLetterService(user , req.body)
      const result = await OfferLetterService.getOfferLetterTemplateService(user)
      return res.status(200).json({
        success: true,
        message: "Offer Letter Template fetched successfully",
        data : result
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadOfferLetterTemplateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {

    const user = (req as any).user;

    const result =
      await OfferLetterService.downloadOfferLetterTemplateService(
        user,
      );

    return res.status(200).json({
      success: true,
      message:
        "Download URL generated successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
}


  
}
