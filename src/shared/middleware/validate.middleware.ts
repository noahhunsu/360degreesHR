import type { NextFunction, Request, Response } from "express"
import type { ZodObject } from "zod"


export const validate =(schema : ZodObject) => {
    return (
        req : Request , res: Response , next : NextFunction
    ) => {
        next()
        try {
            schema.parse(req.body)
        } catch (error) {
            next(error)
        }
    }
}