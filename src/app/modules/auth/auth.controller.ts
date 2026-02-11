import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const login=catchAsyncFn(async(req:Request,res:Response)=>{
    const result=await authService.login(req.body)

    sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:result.email})
})

const verifyOTP=catchAsyncFn(async(req:Request,res:Response)=>{
    const {email,otp}=req.body
const user=await authService.verifyOTP(email,otp)

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"You have successfully Sign in",
    data:user
})
})

const verifyAccount=catchAsyncFn(async(req:Request,res:Response)=>{
    const {email,otp}=req.body
const user=await authService.verifyAccount(email,otp)

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"You have successfully Sign Up",
    data:user
})
})

export const authController={verifyOTP,verifyAccount,login}


