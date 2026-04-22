import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { chatServices } from "./chat.service";

const chat = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await chatServices.chat(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "result.message",
    data: null,
  });
});

export const chatController = { chat };
