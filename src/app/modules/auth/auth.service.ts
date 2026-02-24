import { AppError } from "../../error/AppError";
import { generateToken } from "../../utils/generateToken";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { loginOtpTemplate } from "../../utils/emailTemplates/loginOtpTemplate";
import { generateOTP } from "../../utils/generateOTP";
import config from "../../../config";
import { otpQueueEmail } from "../../bullMQ/init";
import { UserRoleEnum } from "@prisma/client";

const login = async (payload: any) => {
  const { email, password } = payload;
  const userData = await prisma.user.findFirst({ where: { email } });
  if (!userData) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User Not Found");
  }
  if (!userData.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Please try Google login");
  }

  const isCorrectPassword = await bcrypt.compare(password, userData.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  if (userData.role === UserRoleEnum.USER) {
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

    await loginOtpTemplate(
      userData.name,
      "Your Verification OTP",
      userData.email,
      otp,
    );

    return {
      email: userData.email,
      message: "Verification OTP sent to your email. Please verify to Signin.",
    };
  }

  // ✅ Generate access token
  const accessToken = await generateToken(userData);

  return {
    name: userData.name,
    email: userData.email,
    accessToken,
    message: "Login successful"
  };
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user || user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
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
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  // ✅ Generate access token
  const accessToken = await generateToken(user);

  // ✅ Clear OTP fields
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiry: null, isEmailVerified: true },
  });

  return {
    name: user.name,
    email: user.email,
    accessToken,
  };
};

const changePassword = async (
  email: string,
  newPassword: string,
  oldPassword: string,
) => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    user.password ?? "",
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds,
  );
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await otpQueueEmail.add(
    "passwordChangedConfirmation",
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

  return {
    message: "Password changed successfully",
  };
};

export const authService = {
  verifyOTP,
  verifyAccount,
  login,
  changePassword,
};
