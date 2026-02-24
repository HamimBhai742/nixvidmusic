import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { supportService } from "./support.services";
import { Request, Response } from "express";

const createSupportTicket = catchAsyncFn(async (req: Request, res: Response) => {
    const result = await supportService.createSupportTicket(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: null,
    });
});

const closedSupportTicket = catchAsyncFn(async (req: Request, res: Response) => {
    const { ticketId } = req.body
    const result = await supportService.closedSupportTicket(ticketId,req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: null,
    });
});


export const supportController = {
    createSupportTicket,
    closedSupportTicket
};