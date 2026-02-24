import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { resendOtpSchema, resetPasswordSchema, userZodSchema, verifyOtpSchema, verifyRegisterOTPSchema } from "./user.zod.schema";

const router=Router()

router.post('/sign-up',validateRequest(userZodSchema),userController.register)
router.post('/verify-register-otp',validateRequest(verifyRegisterOTPSchema),userController.verifyRegisterOTP)
router.post('/verify-forget-otp',validateRequest(verifyOtpSchema),userController.verifyForgetPasswordOtp)
router.post('/forgot-password',validateRequest(resendOtpSchema),userController.requestPasswordReset)
router.post('/reset-password',validateRequest(resetPasswordSchema),userController.resetPassword)

export const userRoutes=router