import { AppError } from "../../error/AppError";
import { generateToken } from "../../utils/generateToken";
import { prisma } from "../../utils/prisma";
import httpStatus from 'http-status'
import bcrypt from 'bcryptjs'
import { loginOtpTemplate } from "../../utils/emailTemplates/loginOtpTemplate";
import { generateOTP } from "../../utils/generateOTP";


const login = async (payload: any) => {
    const { email, password } = payload;
  const userData: any = await prisma.user.findFirst({ where: { email } });
  if (!userData) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User Not Found');
  }
  if (!userData.password) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please try Google login'
    );
  }

  const isCorrectPassword = await bcrypt.compare(password, userData.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password incorrect');
  }

   const otp= generateOTP()
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

  await loginOtpTemplate(userData.name,'Your Verification OTP',userData.email,otp)

  return {
    email: userData.email,
    message: 'Verification OTP sent to your email. Please verify to Signin.',
  };
};


const verifyOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user || user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  // ✅ Generate access token
  const accessToken = await generateToken(user);

  // ✅ Clear OTP fields
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiry: null },
  });

  return {
    name: user.name,
    email: user.email,
    accessToken,
  };
};


const verifyAccount = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user || user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  // ✅ Generate access token
  const accessToken = await generateToken(user);

  // ✅ Clear OTP fields
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiry: null, isEmailVerified:true },
    
  });

  return {
    name: user.name,
    email: user.email,
    accessToken,
  };
};


export const authService={
    verifyOTP,
    verifyAccount,
    login
}