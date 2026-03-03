import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validationRequest";
import {
  resendOtpSchema,
  resetPasswordSchema,
  userZodSchema,
  verifyOtpSchema,
  verifyRegisterOTPSchema,
} from "./user.zod.schema";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post(
  "/sign-up",
  validateRequest(userZodSchema),
  userController.register,
);
router.post(
  "/verify-register-otp",
  validateRequest(verifyRegisterOTPSchema),
  userController.verifyRegisterOTP,
);
router.post(
  "/verify-forget-otp",
  validateRequest(verifyOtpSchema),
  userController.verifyForgetPasswordOtp,
);
router.post(
  "/forgot-password",
  validateRequest(resendOtpSchema),
  userController.requestPasswordReset,
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  userController.resetPassword,
);

router.put(
  "/update-profile",
  checkAuth(Role.USER),
  userController.updateUserProfile,
);

router.post("/resend-register-otp", userController.resendRegisterOTP);

export const userRoutes = router;
