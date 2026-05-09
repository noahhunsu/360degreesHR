import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  static async registerController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await AuthService.registerService(req.body);
      return res.status(201).json({
        success: true,
        message: "Company Registration Successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await AuthService.loginService(req.body);
      res.status(200).json({
        success: true,
        message: "Login Successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async authMeController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authorization header required",
        });
      }
      const token = authHeader.split(" ")[1] || "";

      const result = await AuthService.authMeService(token);

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
