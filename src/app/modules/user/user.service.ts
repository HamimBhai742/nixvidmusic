import config from "../../../config";
import bcrypt from "bcryptjs";
import { UserPayload } from "../../interface/user.interface";
import { generateOTP } from "../../utils/generateOTP";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/queues/mailQueues";
import { registrationOtpTemplate } from "../../utils/emailTemplates/registrationOtpTemplate";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { generateForgetToken, generateToken } from "../../utils/generateToken";
import { User } from "@prisma/client";

const register = async (payload: UserPayload) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload?.email },
  });
  if (existingUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User already exists!");
  }
  const hashedPass = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds,
  );

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
  const userData = {
    ...payload,
    password: hashedPass,
    otp,
    otpExpiry,
  };
  const user = await prisma.user.create({
    data: userData,
  });

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
    },
  );

  return {
    email: user.email,
    message:
      "Verification OTP sent to your email. Please verify to activate account.",
  };
};

const resendOTP = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      otp,
      otpExpiry,
    },
  });

  await registrationOtpTemplate(
    user.name,
    "Your Verification OTP",
    user.email,
    otp,
  );

  return {
    email: user.email,
    message:
      "Verification OTP sent to your email. Please verify to activate account.",
  };
};

const requestPasswordReset = async (email: string) => {
  console.log(email);
  if (!email) throw new AppError(httpStatus.BAD_REQUEST, "Email is required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "No user found with this email");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const tempToken = await generateForgetToken(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt.access_secret as Secret,
    "5m",
  );

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpiry,
      forgetPasswordToken: tempToken,
      forgetPasswordTokenExpires: otpExpiry,
    },
  });

  await otpQueueEmail.add(
    "forgetPasswordOtp",
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
    },
  );

  return { message: "OTP sent to email", tempToken };
};

const verifyOtp = async (email: string, otp: string, token: string) => {
  if (!email || !otp || !token)
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "No user found with this email");

  if (user.otp !== otp)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  if (!user.forgetPasswordToken || user.forgetPasswordToken !== token)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired token");
  if (
    user.forgetPasswordTokenExpires &&
    user.forgetPasswordTokenExpires < new Date()
  )
    throw new AppError(httpStatus.BAD_REQUEST, "Token expired");

  // ✅ Generate new temporary token for password reset
  const newTempToken = await generateForgetToken(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt.access_secret as Secret,
    "5m",
  );

  // ✅ Update user with new token and expiry
  const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await prisma.user.update({
    where: { email },
    data: {
      forgetPasswordToken: newTempToken,
      forgetPasswordTokenExpires: newExpiry,
    },
  });

  return {
    message: "OTP verified successfully",
    tempToken: newTempToken,
  };
};

const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
) => {
  if (!email || !token || !newPassword)
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "No user found with this email");

  if (!user.forgetPasswordToken || user.forgetPasswordToken !== token)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired token");
  if (
    user.forgetPasswordTokenExpires &&
    user.forgetPasswordTokenExpires < new Date()
  )
    throw new AppError(httpStatus.BAD_REQUEST, "Token expired");

  // ✅ Ensure password is not empty before hashing
  if (!newPassword.trim())
    throw new AppError(httpStatus.BAD_REQUEST, "Password cannot be empty");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
      forgetPasswordToken: null,
      forgetPasswordTokenExpires: null,
    },
  });

  await otpQueueEmail.add(
    "resetPasswordSuccess",
    {
      userName: user.name,
      email: user.email,
      subject: "Password Changed Successfully",
      secureLink: `${config.client_url}/secure-account`,
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );

  return { message: "Password reset successfully" };
};


const updateUserProfile = async (userId: string, data: Partial<User>) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const hashedPassword=await bcrypt.hash(data.password as string,config.bcrypt_salt_rounds)
  data.password=hashedPassword

  return await prisma.user.update({ where: { id: userId }, data });
};

export const userServices = {
  register,
  resendOTP,
  verifyOtp,
  resetPassword,
  requestPasswordReset,
  updateUserProfile
};
