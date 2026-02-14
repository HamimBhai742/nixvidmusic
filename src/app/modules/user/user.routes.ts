import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { resendOtpSchema, resetPasswordSchema, userZodSchema, verifyOtpSchema } from "./user.zod.schema";

const router=Router()

router.post('/register',validateRequest(userZodSchema),userController.register)
router.post('/resend-otp',validateRequest(resendOtpSchema),userController.resendOTP)
router.post('/verify-otp',validateRequest(verifyOtpSchema),userController.verifyOtp)
router.post('/forgot-password',validateRequest(resendOtpSchema),userController.requestPasswordReset)
router.post('/reset-password',validateRequest(resetPasswordSchema),userController.resetPassword)

export const userRoutes=router