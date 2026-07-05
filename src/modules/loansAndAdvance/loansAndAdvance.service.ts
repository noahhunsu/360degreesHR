import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../config/db.js";

import {
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type {
  CreateSalaryAdvanceInput,

} from "./loansAndAdvance.validation.js";

export class LoansAndAdvanceService {
  static async createSalaryAdvanceService(
    user : User,
    payload: CreateSalaryAdvanceInput,
    
  ) {
       if(!user){
        throw new UnauthorizedError("You are not authorized")
       }

       const employee = await prismaClient.employee.findFirst({
        where : {
          userId : user.userId , companyId :user.companyId
        }
       })

       if(!employee){
                throw new NotFoundError("Employee does not exist")
       }

       const salaryAdvance = await prismaClient.salaryAdvance.create({
        data : {
          employeeId : employee.id, 
          companyId : user.companyId , 
          requestedAmount : payload.requestedAmount, 
          ...(payload.reason && {reason : payload.reason}) , 
          requestedById : user.userId , 

        }
       })
       return salaryAdvance
  }

  static async updateSalaryAdvanceService(user : User , ){}
}