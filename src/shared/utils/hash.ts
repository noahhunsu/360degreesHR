
import bcrypt from "bcryptjs"

export const hashpassword = async (password : string) =>{
    return bcrypt.hash(password , 10)
}

export const comparePassword = async (password : string , hashedPassword : string  ) => {
    return bcrypt.compare(password , hashedPassword)
}