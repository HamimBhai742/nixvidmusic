import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { redeemCodeService } from "./redeemCode.service";
import { prisma } from "../../utils/prisma";
import { IJwtPayload } from "../../interface/user.interface";

// ADMIN CONTROLLERS

const generateRedeemCodes = catchAsyncFn(async (req: Request & { user?: IJwtPayload }, res: Response) => {
  const adminId = req.user?.userId || "";
  const result = await redeemCodeService.generateRedeemCodes(adminId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Codes generated successfully",
    data: result,
  });
});

const getAllRedeemCodes = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.getAllRedeemCodes(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem codes fetched successfully",
    data: result.data,
    metaData: result.metaData,
  });
});

const getRedeemCodeById = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.getRedeemCodeById(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem code details fetched successfully",
    data: result,
  });
});

const disableRedeemCode = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.disableRedeemCode(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem code disabled successfully",
    data: result,
  });
});

const enableRedeemCode = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.enableRedeemCode(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem code enabled successfully",
    data: result,
  });
});

const deleteRedeemCode = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.deleteRedeemCode(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

const exportRedeemCodesCsv = catchAsyncFn(async (req: Request, res: Response) => {
  const { batchId, type, status } = req.query;

  const whereConditions: any = {};
  if (batchId) whereConditions.batchId = batchId as string;
  if (type) whereConditions.type = type as any;
  if (status) whereConditions.status = status as any;

  const codes = await prisma.redeemCode.findMany({
    where: whereConditions,
    orderBy: { createdAt: "desc" },
  });

  // Dynamically determine the application base URL
  const host = req.get("host") || "localhost:5000";
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const appDomain = `${protocol}://${host}`;

  // CSV Headers
  const csvHeaders = ["Code", "QR URL", "Type", "Scans Allowed", "Status", "Source", "Expiry Date", "Created Date"];
  const csvRows = [csvHeaders.join(",")];

  for (const code of codes) {
    const qrUrl = `${appDomain}/redeem?code=${code.code}`;
    const expiryDate = code.expiresAt ? code.expiresAt.toISOString() : "N/A";
    const createdDate = code.createdAt.toISOString();

    const row = [
      `"${code.code}"`,
      `"${qrUrl}"`,
      `"${code.type}"`,
      code.scansAllowed,
      `"${code.status}"`,
      `"${code.source || "N/A"}"`,
      `"${expiryDate}"`,
      `"${createdDate}"`,
    ];
    csvRows.push(row.join(","));
  }

  const csvString = csvRows.join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=redeem_codes_export_${Date.now()}.csv`);
  res.status(httpStatus.OK).send(csvString);
});

const getAllBatches = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.getAllBatches();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem code batches fetched successfully",
    data: result,
  });
});

const getBatchDetails = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.getBatchDetails(req.params.batchId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Batch details fetched successfully",
    data: result,
  });
});

// USER CONTROLLERS

const validateRedeemCode = catchAsyncFn(async (req: Request, res: Response) => {
  const { code } = req.body;
  const result = await redeemCodeService.validateRedeemCode(code);

  if (!result.valid) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: result.message || "Invalid redeem code.",
      data: { valid: false },
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem code is valid.",
    data: {
      valid: true,
      ...result.data,
    },
  });
});

const applyRedeemCode = catchAsyncFn(async (req: Request & { user?: IJwtPayload }, res: Response) => {
  const userId = req.user?.userId || "";
  const { code } = req.body;
  const result = await redeemCodeService.applyRedeemCode(userId, code);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Creator Pass unlocked successfully.",
    data: result,
  });
});

const getUserAccessStatus = catchAsyncFn(async (req: Request & { user?: IJwtPayload }, res: Response) => {
  const userId = req.user?.userId || "";
  const result = await redeemCodeService.getUserAccessStatus(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User access status fetched successfully.",
    data: result,
  });
});

const useScan = catchAsyncFn(async (req: Request & { user?: IJwtPayload }, res: Response) => {
  const userId = req.user?.userId || "";
  const { scanType } = req.body;
  const result = await redeemCodeService.useScan(userId, scanType);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: result,
  });
});

const getScanUsageHistory = catchAsyncFn(async (req: Request & { user?: IJwtPayload }, res: Response) => {
  const userId = req.user?.userId || "";
  const result = await redeemCodeService.getScanUsageHistory(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Scan usage history fetched successfully.",
    data: result.data,
    metaData: result.metaData,
  });
});

const getAdminDashboardOverview = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await redeemCodeService.getAdminDashboardOverview(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard overview fetched successfully.",
    data: result,
  });
});

const getAdminRedeemCodesOverview = catchAsyncFn(async (_req: Request, res: Response) => {
  const result = await redeemCodeService.getAdminRedeemCodesOverview();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Redeem codes overview fetched successfully.",
    data: result,
  });
});

export const redeemCodeController = {
  generateRedeemCodes,
  getAllRedeemCodes,
  getRedeemCodeById,
  disableRedeemCode,
  enableRedeemCode,
  deleteRedeemCode,
  exportRedeemCodesCsv,
  getAllBatches,
  getBatchDetails,
  validateRedeemCode,
  applyRedeemCode,
  getUserAccessStatus,
  useScan,
  getScanUsageHistory,
  getAdminDashboardOverview,
  getAdminRedeemCodesOverview,
};
