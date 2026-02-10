import config from "../../../config";
import bcrypt from 'bcryptjs'
import { UserPayload } from "../../interface/user.interface";
import { generateOTP } from "../../utils/generateOTP";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/queues/mailQueues";

const register=async(payload:UserPayload)=>{
    const hashedPass=await bcrypt.hash(payload.password,config.bcrypt_salt_rounds)

    const otp=generateOTP()
    const otpExpiry=new Date(Date.now() + 2 * 60 * 1000)

   return  await prisma.$transaction(async (tx) => {
           const user =await prisma.user.create({
             data:{
        ...payload,
        password:hashedPass,
        otp, otpExpiry
        
    }

    
}
)

  // Queue OTP *after* successful commit
  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: user.name,
      email: user.email,
      otpCode: otp,
      subject: "Your Verification OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    }
  );

 return{
    id:user.id,
     message:'Verification OTP sent to your email. Please verify to activate account.'
 }
    })
 
}


export const userServices={
    register
}