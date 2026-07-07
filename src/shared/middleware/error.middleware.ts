

// import { Request, Response, NextFunction } from "express";
// import { AppError } from "../utils/AppError";

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../exceptions/app.error.js";

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            statusCode: error.statusCode,
            error: error.constructor.name,
            message: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "InternalServerError",
        message: "Internal Server Error",
    });
};