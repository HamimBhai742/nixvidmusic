import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { contractServices } from "./contract.service";
import catchAsyncFn from "../../utils/catchAsyncFn";

const contractAnalysis = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await contractServices.contractAnalysis(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "result.message",
    data: null,
  });
});

export const contractController = { contractAnalysis };
