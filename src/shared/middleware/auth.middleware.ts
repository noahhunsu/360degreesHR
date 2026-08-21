


import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../shared/utils/jwt.js";
import { prismaClient } from "../../config/db.js";
import type { AuthorizationContext, User } from "../types/global.types.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/app.error.js";

export const parseAuthHeaderMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("token unavailable")
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

export const parseAuthorizationMiddleware = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user: User = (req as any).user;

      const userRoles = await prismaClient.userRole.findMany({
        where: {
          userId: user.userId,
          role: {
            companyId: user.companyId,
          },
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const userPermissions = [
        ...new Set(
          userRoles.flatMap((userRole) =>
            userRole.role.permissions.map(
              (rolePermission) =>
                rolePermission.permission.name
            )
          )
        ),
      ];

      const authorizationContext: AuthorizationContext = {
        userId: user.userId,
        companyId: user.companyId,
        permissions: userPermissions,
      };

      (req as any).authorizationContext = authorizationContext;

      next();
    } catch (error) {
      next(error);
    }
  };
};
export const requiredPermission = (permissions: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorization = (req as any).authorizationContext;

      console.log(
        "the authorization context is ",
        authorization
      );

      if (!authorization) {
        throw new UnauthorizedError(
          "Authorization context not found"
        );
      }

      const hasPermission = permissions.some(
        (permission) =>
          authorization.permissions.includes(permission)
      );

      if (!hasPermission) {
        throw new BadRequestError(
          "You do not have permission to perform this action"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};