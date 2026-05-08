import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";



export class AuthController {
    static async register(
        req : Request, res : Response , next : NextFunction 
    ){
        console.log("currently here creating accout")
        try {
            const result = await AuthService.registerService(req.body)
            return res.status(201).json({
                success : true , 
                message :"Company Registration Successful",
                data : result
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(
        req : Request , res : Response , next : NextFunction 
    ) {
        try {
            const result = await AuthService.login(req.body)
            res.status(200).json({
                success : true , 
                message :"Login Successful",
                data : result
            })
        } catch (error) {
            next(error)
        }
    }
}