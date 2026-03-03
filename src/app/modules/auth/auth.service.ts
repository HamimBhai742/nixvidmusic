import { AppError } from "../../error/AppError";
import { generateToken } from "../../utils/generateToken";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { loginOtpTemplate } from "../../utils/emailTemplates/loginOtpTemplate";
import { generateOTP } from "../../utils/generateOTP";
import config from "../../../config";
import { otpQueueEmail } from "../../bullMQ/init";
import { Role } from "../../interface/user.interface";

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

  if (userData.role === Role.USER) {
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

    await otpQueueEmail.add(
      "loginOtp",
      {
        userName: userData.name,
        email: userData.email,
        otpCode: otp,
        subject: "Your Verification OTP",
      },
      {
        jobId: `${userData.id}-${Date.now()}`,
        removeOnComplete: true,
        attempts: 5,
        backoff: { type: "fixed", delay: 5000 },
      },
    );

    return {
      data: {
        email: userData.email,
      },
      message: "Verification OTP sent to your email. Please verify to Signin.",
    };
  }

  // ✅ Generate access token
  const accessToken = await generateToken(userData);

  return {
    data: {
      name: userData.name,
      email: userData.email,
      accessToken,
    },
    message: "Login successful",
  };
};

const resendLoginOTP = async (email: string) => {
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

  await otpQueueEmail.add(
    "loginOtp",
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

const getMe = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
};



export const authService = {
  verifyOTP,
  login,
  changePassword,
  resendLoginOTP,
  getMe
};
