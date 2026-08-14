import { prismaClient } from "../config/db.js"
import { NotFoundError, UnauthorizedError } from "../shared/exceptions/app.error.js"
import type { User } from "../shared/types/global.types.js"
import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../shared/utils/jwt.js";
// import { verifyToken } from "../../shared/utils/jwt.js";


export const assertHR = (user : User) =>  {
    if(!user || user.role !== "HR_ADMIN"){

        throw new UnauthorizedError("You are unauthorized to perform this action")
    }
}

export const assertUser = ( user : User) =>{
    
    if(!user ){
        throw new UnauthorizedError("You are unauthorized to perform this action")
    }
}

export const getRole = (user : User ) => {
    return user.role
}

export const getEmployee = async (user : User ) => {
    const employee = await prismaClient.employee.findFirst({
        where : {
            companyId : user.companyId , userId : user.userId
        }
    })

    if(!employee){
        throw new NotFoundError("Employee not found")
    }
    return employee
}

export const checkUserInCompany = async (user : User , userId : string )=>{
   const companyUser = await prismaClient.user.findFirst({
      where : {
        companyId : user.companyId , 
        id : userId
      }
    })

    if(!companyUser) {
      throw new NotFoundError("User not found ")
    } 

    return companyUser
}





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
