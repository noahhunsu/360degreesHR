import { prismaClient } from "../config/db.js"
import { NotFoundError, UnauthorizedError } from "../shared/exceptions/app.error.js"
import type { User } from "../shared/types/global.types.js"


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