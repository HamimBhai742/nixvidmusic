import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const register=catchAsyncFn(async(req:Request,res:Response)=>{
const result=await userServices.register(req.body)

sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:null})
})

const resendOTP=async(req:Request,res:Response)=>{
    const result=await userServices.resendOTP(req.body.email)

    sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:null})
}

export const userController={register,resendOTP}