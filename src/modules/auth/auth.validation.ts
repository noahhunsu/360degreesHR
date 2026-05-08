

import * as z from "zod";

export const registerSchema = z.object({
    companyName : z.string().min(3), 
    companyEmail : z.email(), 

    companyAddress : z.string().optional(), 
    companyPhone : z.string().min(6).optional(),
    
    adminName : z.string().min(3), 
    adminEmail : z.email(), 
    password : z.string().min(8)
    
})


export const loginSchema = z.object({
    userEmail : z.email(),
    password : z.string()
})
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>