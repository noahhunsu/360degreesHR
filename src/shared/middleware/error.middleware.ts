

// import { Request, Response, NextFunction } from "express";
// import { AppError } from "../utils/AppError";

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../exceptions/app.error.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error(error);

  res.status(400)
  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};