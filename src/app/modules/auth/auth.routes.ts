import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()

router.post('/sign-in',authController.login)
router.post('/verify-otp',authController.verifyOTP)
router.post('/verify-account',authController.verifyAccount)

export const authRoutes=router