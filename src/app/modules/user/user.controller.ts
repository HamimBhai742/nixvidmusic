import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJwtPayload } from "../../interface/user.interface";

const register = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await userServices.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

const verifyRegisterOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await userServices.verifyRegisterOtp(
    req.body.email,
    req.body.otp,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "You have successfully Sign up",
    data: result,
  });
});

const resendRegisterOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await userServices.resendRegisterOTP(req.body.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

const requestPasswordReset = catchAsyncFn(
  async (req: Request, res: Response) => {
    const result = await userServices.requestPasswordReset(req.body.email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: result.tempToken,
    });
  },
);

const verifyForgetPasswordOtp = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await userServices.verifyForgetPasswordOtp(
    req.body.email,
    req.body.otp,
    req.body.token,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: result.tempToken,
  });
});

const resetPassword = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await userServices.resetPassword(
    req.body.email,
    req.body.token,
    req.body.newPassword,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

const updateUserProfile = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await userServices.updateUserProfile(
      userId as string,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: null,
    });
  },
);

export const userController = {
  register,
  resendRegisterOTP,
  requestPasswordReset,
  verifyForgetPasswordOtp,
  resetPassword,
  updateUserProfile,
  verifyRegisterOTP
};
