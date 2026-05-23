import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getUserManagementOverview = catchAsyncFn(async (_req: Request, res: Response) => {
  const result = await adminService.getUserManagementOverview();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User management overview fetched successfully.",
    data: result,
  });
});

const getRecentUserActivity = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await adminService.getRecentUserActivity(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Recent user activity fetched successfully.",
    data: result,
  });
});

export const adminController = {
  getUserManagementOverview,
  getRecentUserActivity,
};

