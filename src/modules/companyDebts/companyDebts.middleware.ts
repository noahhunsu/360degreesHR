


import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../shared/utils/jwt.js";

export const parseAuthHeaderMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authorization header required",
        });
      }
      const token = authHeader.split(" ")[1] || "";
      const decoded = verifyToken(token);
      (req as any).user = decoded;
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
