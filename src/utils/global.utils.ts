import { UnauthorizedError } from "../shared/exceptions/app.error.js"
import type { User } from "../shared/types/global.types.js"


export const assertHR = (user : User) =>  {
}

export const assertUser = ( user : User) =>{
    
    if(!user ){
        throw new UnauthorizedError("You are unauthorized to perform this action")
    }
}