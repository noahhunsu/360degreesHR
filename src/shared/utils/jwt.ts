

import jwt from "jsonwebtoken"

export const generateAccessToken = (payload : Record<string , unknown>) => {
    return jwt.sign(payload , process.env.JWT_SECRET as string, {
        expiresIn : "7d"
    })
}
