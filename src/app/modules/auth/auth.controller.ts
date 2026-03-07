import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJwtPayload } from "../../interface/user.interface";

const login = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message as string,
    data: result.data,
  });
});

const googleLogin = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await authService.googleLogin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "You have successfully Sign in",
    data: result,
  });
});

const verifyOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await authService.verifyOTP(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "You have successfully Sign in",
    data: user,
  });
});

const resendLoginOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await authService.resendLoginOTP(req.body.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message as string,
    data: null,
  });
});

const getNewAccessToken = catchAsyncFn(async (req: Request, res: Response) => {
  const accessToken = await authService.getNewAccessToken(
    req.body.refreshToken,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New access token generated successfully",
    data: accessToken,
  });
});

const changePassword = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { email } = req.user as IJwtPayload;
    const { newPassword, oldPassword } = req.body;
    const user = await authService.changePassword(
      email,
      newPassword,
      oldPassword,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: user.message,
      data: null,
    });
  },
);

const getMe = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = await authService.getMe(req.user?.email as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User details fetched successfully",
      data: user,
    });
  },
);

export const authController = {
  verifyOTP,
  login,
  changePassword,
  resendLoginOTP,
  getMe,
  getNewAccessToken,
  googleLogin,
};
