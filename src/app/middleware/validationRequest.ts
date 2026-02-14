import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest = (zodSchema:ZodObject<ZodRawShape>)=>async(req:Request, res:Response, next:NextFunction)=>{
    try{
        console.log(zodSchema)
    req.body = zodSchema.parse(req.body)
        return next();
    }catch(err){
        next(err);
    }
}