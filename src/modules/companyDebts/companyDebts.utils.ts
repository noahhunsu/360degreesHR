import { prismaClient } from "../../config/db.js"
import type { User } from "../../shared/types/global.types.js"


export const getSalaryAdvanceRequest =  async (user : User , salaryRequestId : string) =>{
    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
        where : {
            
        }
    })
}