import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { contractServices } from "./contract.service";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { IJwtPayload } from "../../interface/user.interface";

const contractAnalysis = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await contractServices.contractAnalysis(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contract analyzed successfully",
    data: result,
  });
});

const getRecentContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.getRecentContracts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Recent contracts retrieved successfully",
      data: result,
    });
  },
);

const getAllContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.getAllContracts(
      userId as string,
      req?.query?.searchTerm as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all contracts successfully",
      data: result,
    });
  },
);

const totalContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.totalContracts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Total contracts retrieved successfully",
      data: result,
    });
  },
);

const highRiskContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.highRiskContracts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "High risk contracts retrieved successfully",
      data: result,
    });
  },
);

const mediumRiskContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.mediumRiskContracts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Medium risk contracts retrieved successfully",
      data: result,
    });
  },
);

const lowRiskContracts = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const userId = req.user?.userId;
    const result = await contractServices.lowRiskContracts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Low risk contracts retrieved successfully",
      data: result,
    });
  },
);

export const contractController = {
  contractAnalysis,
  getRecentContracts,
  getAllContracts,
  totalContracts,
  highRiskContracts,
  mediumRiskContracts,
  lowRiskContracts,
};
