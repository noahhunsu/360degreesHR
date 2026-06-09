import type { NextFunction, Request, Response } from "express"
import type { ZodObject } from "zod"


export const validate =(schema : ZodObject) => {
    return (
        req : Request , res: Response , next : NextFunction
    ) => {
        try {
            console.log(req.body)
            schema.parse(req.body)
            next()
        } catch (error) {
            next(error)
        }
    }
}