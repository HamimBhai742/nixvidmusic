import config from "../../../config";
import bcrypt from 'bcryptjs'
import { UserPayload } from "../../interface/user.interface";
import { generateOTP } from "../../utils/generateOTP";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/queues/mailQueues";
import sendEmail from "../../utils/emailTemplates/nodemailerTransport";
import { registrationOtpTemplate } from "../../utils/emailTemplates/registrationOtpTemplate";
import { AppError } from "../../error/AppError";
import httpStatus from 'http-status'
import { email } from "zod";

const register=async(payload:UserPayload)=>{
   const existingUser = await prisma.user.findFirst({
    where: { email: payload?.email },
  });
  if (existingUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User already exists!');
  }
    const hashedPass=await bcrypt.hash(payload.password,config.bcrypt_salt_rounds)

    const otp=generateOTP()
    const otpExpiry=new Date(Date.now() + 2 * 60 * 1000)
const userData={
  ...payload,
  password:hashedPass,
  otp,
  otpExpiry
}
  const user = await prisma.user.create({
    data: userData
  });
  const a= await registrationOtpTemplate(user.name,'Your Verification OTP',user.email,otp)
  console.log(a)
  return {
    email: user.email,
    message: 'Verification OTP sent to your email. Please verify to activate account.'
  };
 
}


const resendOTP=async(email:string)=>{
const user=await prisma.user.findFirst({
  where:{email}
})
if(!user){
  throw new AppError(httpStatus.NOT_FOUND,'User not found')
}

   const otp=generateOTP()
    const otpExpiry=new Date(Date.now() + 2 * 60 * 1000)

    await prisma.user.update({
      where:{
        email
      },
      data:{
        otp,
        otpExpiry
      }
    })

    await registrationOtpTemplate(user.name,'Your Verification OTP',user.email,otp)

    return {
    email: user.email,
    message: 'Verification OTP sent to your email. Please verify to activate account.'
  };
}


export const userServices={
    register,
    resendOTP
}