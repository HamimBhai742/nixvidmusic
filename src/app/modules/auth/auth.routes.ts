import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRoleEnum } from "@prisma/client";
import { validateRequest } from "../../middleware/validationRequest";
import { authZodSchema, changePasswordSchema, verifyOtpSchema } from "./auth.zod.schema";

const router=Router()

router.post('/sign-in',validateRequest(authZodSchema),authController.login)
router.post('/verify-otp',validateRequest(verifyOtpSchema),authController.verifyOTP)
router.post('/verify-account',validateRequest(verifyOtpSchema),authController.verifyAccount)
router.post('/change-password',checkAuth(UserRoleEnum.USER),validateRequest(changePasswordSchema),authController.changePassword)

export const authRoutes=router