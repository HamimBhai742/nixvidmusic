import config from "../../../config";
import bcrypt from "bcryptjs";
import { UserPayload } from "../../interface/user.interface";
import { generateOtp } from "../../utils/generateOTP";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/queues/mailQueues";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { generateForgetToken, generateToken } from "../../utils/generateToken";
import e from "express";
import { registrationOtpTemplate } from "../../utils/emailTemplates/registrationOtpTemplate";
import { forgetPasswordOtpTemplate } from "../../utils/emailTemplates/forgetPasswordOtpTemplate";
import { passwordResetSuccessTemplate } from "../../utils/emailTemplates/passwordResetSuccessTemplate";
import { registrationSuccessTemplate } from "../../utils/emailTemplates/registrationSuccessTemplate";

const register = async (payload: UserPayload) => {
  console.log(payload)
  const existingUser = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  const hashedPass = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds,
  );

  const otp = generateOtp(6);
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
  const userData = {
    ...payload,
    password: hashedPass,
    otp,
    otpExpiry,
  };

  if (
    existingUser?.status === "PENDING" &&
    existingUser?.isEmailVerified === false
  ) {
    // await otpQueueEmail.add(
    //   "registrationOtp",
    //   {
    //     userName: existingUser.name,
    //     email: existingUser.email,
    //     otpCode: otp,
    //     subject: "Your Verification OTP",
    //   },
    //   {
    //     jobId: `${existingUser.id}-${Date.now()}`,
    //     removeOnComplete: true,
    //     attempts: 3,
    //     backoff: { type: "fixed", delay: 5000 },
    //   },
    // );

    await registrationOtpTemplate(
      existingUser.name,
      "Your Verification OTP",
      existingUser.email,
      otp,
    );
    return {
      email: existingUser.email,
      message:
        "Verification OTP sent to your email. Please verify to activate account.",
    };
  }

  if (existingUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User already exists!");
  }

  const user = await prisma.user.create({
    data: userData,
  });

  // await otpQueueEmail.add(
  //   "registrationOtp",
  //   {
  //     userName: user.name,
  //     email: user.email,
  //     otpCode: otp,
  //     subject: "Your Verification OTP",
  //   },
  //   {
  //     jobId: `${user.id}-${Date.now()}`,
  //     removeOnComplete: true,
  //     attempts: 3,
  //     backoff: { type: "fixed", delay: 5000 },
  //   },
  // );

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

const verifyRegisterOtp = async (email: string, otp: string) => {
  if (!email || !otp)
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      otp: null,
      otpExpiry: null,
      isEmailVerified: true,
      status: "ACTIVE",
    },
  });

  const token = await generateToken(user);

  await registrationSuccessTemplate(user.name, user.email);
  return {
    name: user.name,
    email: user.email,
    token,
  };
};

const resendRegisterOTP = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = generateOtp(6);
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      otp,
      otpExpiry,
    },
  });

  // await otpQueueEmail.add(
  //   "registrationOtp",
  //   {
  //     userName: user.name,
  //     email: user.email,
  //     otpCode: otp,
  //     subject: "Your Verification OTP",
  //   },
  //   {
  //     jobId: `${user.id}-${Date.now()}`,
  //     removeOnComplete: true,
  //     attempts: 3,
  //     backoff: { type: "fixed", delay: 5000 },
  //   },
  // );

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
  if (!email) throw new AppError(httpStatus.BAD_REQUEST, "Email is required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "No user found with this email");

  const otp = generateOtp(6);
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  const tempToken = await generateForgetToken(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt.access_secret as Secret,
    "2m",
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

  // await otpQueueEmail.add(
  //   "forgetPasswordOtp",
  //   {
  //     userName: user.name,
  //     email: user.email,
  //     otpCode: otp,
  //     subject: "Your Reset Password OTP",
  //   },
  //   {
  //     jobId: `${user.id}-${Date.now()}`,
  //     removeOnComplete: true,
  //     attempts: 3,
  //     backoff: { type: "fixed", delay: 5000 },
  //   },
  // );

  await forgetPasswordOtpTemplate(
    user.name,
    "Your Reset Password OTP",
    email,
    otp,
  );
  return { message: "OTP sent to email", tempToken };
};

const verifyForgetPasswordOtp = async (
  email: string,
  otp: string,
  token: string,
) => {
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
    "2m",
  );

  // ✅ Update user with new token and expiry
  const newExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
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

  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds,
  );

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

  // await otpQueueEmail.add(
  //   "resetPasswordSuccess",
  //   {
  //     userName: user.name,
  //     email: user.email,
  //     subject: "Password reset successfully",
  //     secureLink: `${config.client_url}/secure-account`,
  //   },
  //   {
  //     jobId: `${user.id}-${Date.now()}`,
  //     removeOnComplete: true,
  //     attempts: 3,
  //     backoff: { type: "fixed", delay: 5000 },
  //   },
  // );

  const loginLink = `${config.client_url}/login`;
  await passwordResetSuccessTemplate(
    user.name,
    "Password reset successfully",
    email,
    loginLink,
  );
  return { message: "Password reset successfully" };
};

const updateUserProfile = async (userId: string, data: any) => {
  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Update data is required");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (data?.password) {
    const hashedPassword = await bcrypt.hash(
      data.password as string,
      config.bcrypt_salt_rounds,
    );
    data.password = hashedPassword;
  }

  return await prisma.user.update({ where: { id: userId }, data });
};

const profilePhotoUpdate = async (userId: string, image: string) => {
  if (!image) {
    throw new AppError(httpStatus.BAD_REQUEST, "Update data is required");
  }
  return await prisma.user.update({ where: { id: userId }, data: { image } });
};

const getAllUsers = async () =>
  prisma.user.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

export const userServices = {
  register,
  resendRegisterOTP,
  verifyForgetPasswordOtp,
  resetPassword,
  requestPasswordReset,
  updateUserProfile,
  verifyRegisterOtp,
  profilePhotoUpdate,
  getAllUsers,
};
