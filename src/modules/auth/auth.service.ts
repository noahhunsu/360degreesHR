// Registering companies
// login
// logout
// forgot password
// reset password

import { error } from "node:console";
import { Role } from "../../../generated/prisma/enums.js";
import { prismaClient } from "../../config/db.js";
import { comparePassword, hashpassword } from "../../shared/utils/hash.js";
import { generateAccessToken, verifyToken } from "../../shared/utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { UnauthorizedError } from "../../shared/exceptions/app.error.js";

export class AuthService {
  static async registerService(payload: RegisterInput) {
    // destructuring the payload
    const {
      companyEmail,
      companyName,
      adminEmail,
      adminName,
      password,
      companyAddress,
      companyPhone,
    } = payload;

    // check if company already exists in database
    const existingCompany = await prismaClient.company.findUnique({
      where: { email: companyEmail },
    });

    if (existingCompany) {
      throw new Error("Company Already Exists");
    }

    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (existingUser) {
      throw new Error("User Already Exists");
    }
    // Next , we hash the password
    const hashedPassword = await hashpassword(password);
    // Next , we start a transaction
    const result = await prismaClient.$transaction(async (tx) => {
      // We create the company record . We require the email , name , phone(optional ) , address ( optional)
      const company = await tx.company.create({
        data: {
          email: companyEmail,
          name: companyName,
          phone: companyPhone || "",
          address: companyAddress || "",
        },
      });
      const user = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: Role.HR_ADMIN,
          companyId: company.id,
        },
      });
      return {
        company,
        user,
      };
    });
    const token = generateAccessToken({
      userId: result.user.id,
      role: result.user.role,
      companyId: result.company.id,
    });

    // At this point , an email will be sent to them 
    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
      },
    };
  }

  static async loginService(payload : LoginInput) {
    const {userEmail , password} = payload;
    // check if user exists from email 

    const existingUser = await prismaClient.user.findUnique({
        where : {
            email : userEmail
        }
    })

    if(!existingUser ){
        throw new Error ("You are unauthorized to perform this action ")
    }
    const isPasswordMatch = await comparePassword(password , existingUser.password);
    
    if (!isPasswordMatch) {
        throw new Error ("Password Mismatch")
    }
    const token =  generateAccessToken({
        userId : existingUser.id , 
        companyId : existingUser.companyId, 
        role : existingUser.role
    })
    return {
        token, 
        user : {
            userId : existingUser?.id , 
            role : existingUser?.role, 
            companyId : existingUser.companyId
        
        }
      };
  }

  static async authMeService(authToken : string ) {
    let data = verifyToken(authToken);

    console.log("data is ", data )
    const user = await prismaClient.user.findUnique({
      where : {
        id : data.userId
      }
    });

    if (!user){
      throw new UnauthorizedError();
    }
    return {
      userId : user.id , 
      name : user.name , 
      email : user.email,
      role : user.role , 
      companyId : user.companyId , 
    }
  }
}


