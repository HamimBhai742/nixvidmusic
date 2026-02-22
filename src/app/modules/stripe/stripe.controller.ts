
import httpStatus from "http-status";
import {
  createSubscriptionIntoDb,
  getAllSubscriptionPlans,
  purchaseSubscription,
  unsubscribeSubscription,
} from "./stripe.service";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { IJwtPayload } from "../../interface/user.interface";

// ===== Subscription Controllers =====
const createPlanController = catchAsyncFn(async (req, res) => {
  const plan = await createSubscriptionIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription plan created successfully",
    data: plan,
  });
});

const getAllPlansController = catchAsyncFn(async (_req, res) => {
  const plans = await getAllSubscriptionPlans();

  console.log(plans)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    data: plans,
  });
});

const purchaseSubscriptionController = catchAsyncFn(async (req:Request & { user?: IJwtPayload }, res:Response) => {
  const userId = req.user?.userId; // normally from auth middleware
  const sub = await purchaseSubscription(req.body, userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription purchased successfully",
    data: sub,
  });
});

const unsubscribeSubscriptionController = catchAsyncFn(async (req:Request & { user?: IJwtPayload }, res:Response) => {
  const { planId } = req.body;
  const userId = req.user?.userId;
  const result = await unsubscribeSubscription(userId as string, planId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription cancelled successfully",
    data: result,
  });
});

export const subscriptionController = {
  createPlanController,
  getAllPlansController,
  purchaseSubscriptionController,
  unsubscribeSubscriptionController,
};
