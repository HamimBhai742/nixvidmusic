import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRoleEnum } from "@prisma/client";

const router=Router()

router.post('/sign-in',authController.login)
router.post('/verify-otp',authController.verifyOTP)
router.post('/verify-account',authController.verifyAccount)
router.post('/change-password',checkAuth(UserRoleEnum.USER),authController.changePassword)

export const authRoutes=router