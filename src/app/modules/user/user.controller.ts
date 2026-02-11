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

const requestPasswordReset=async(req:Request,res:Response)=>{
    const result=await userServices.requestPasswordReset(req.body.email)

    sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:result.tempToken})
}

const verifyOtp=async(req:Request,res:Response)=>{
     const { email, otp, token } = req.body;
    const result=await userServices.verifyOtp(email, otp, token)

    sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:result.tempToken})
}

const resetPassword=async(req:Request,res:Response)=>{
      const { email, token, newPassword } = req.body;

    const result=await userServices.resetPassword(email, token, newPassword)

    sendResponse(res,{success:true,statusCode:httpStatus.OK,message:result.message,data:null})
}

export const userController={register,resendOTP,requestPasswordReset,verifyOtp,resetPassword}