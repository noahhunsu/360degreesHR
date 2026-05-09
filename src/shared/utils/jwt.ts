

import jwt from "jsonwebtoken"
import type { TokenContent } from "../../modules/auth/auth.types.js"

export const generateAccessToken = (payload : Record<string , unknown>) => {
    return jwt.sign(payload , process.env.JWT_SECRET as string, {
        expiresIn : "7d"
    })
}

export const verifyToken = (token : string): TokenContent => {
    try {

        const data =  jwt.verify(token ,process.env.JWT_SECRET!) 
        console.log(data)
        return data as TokenContent
        
        
    }
    catch(error){
        console.log("error ", token)
        throw new Error("Invalid or expired token");
    }
}
