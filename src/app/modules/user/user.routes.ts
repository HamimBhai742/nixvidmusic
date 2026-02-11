import { Router } from "express";
import { userController } from "./user.controller";

const router=Router()

router.post('/register',userController.register)
router.post('/resend-otp',userController.resendOTP)
router.post('/verify-otp',userController.verifyOtp)
router.post('/forgot-password',userController.requestPasswordReset)
router.post('/reset-password',userController.resetPassword)

export const userRoutes=router