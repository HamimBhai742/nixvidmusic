import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { chatServices } from "./chat.service";

const createChat = catchAsyncFn(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await chatServices.createChat(req.user.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Chat created successfully",
      data: result,
    });
  },
);

const chat = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await chatServices.chat(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Chat response retrieved successfully",
    data: result,
  });
});

const getMyChat = catchAsyncFn(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await chatServices.getMyChat(
      req.params.chatId as string,
      req.user.userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Chat response retrieved successfully",
      data: result,
    });
  },
);

const deleteChat = catchAsyncFn(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await chatServices.deleteChat(
      req.params.chatId as string,
      req.user.userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Chat deleted successfully",
      data: result,
    });
  },
);

export const chatController = { chat, createChat, getMyChat , deleteChat};
