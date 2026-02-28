import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import {
  authZodSchema,
  changePasswordSchema,
  verifyOtpSchema,
} from "./auth.zod.schema";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post("/sign-in", validateRequest(authZodSchema), authController.login);

router.post(
  "/verify-otp",
  validateRequest(verifyOtpSchema),
  authController.verifyOTP,
);

router.post(
  "/change-password",
  checkAuth(Role.USER),
  validateRequest(changePasswordSchema),
  authController.changePassword,
);

router.post("/resend-login-otp", authController.resendLoginOTP);

export const authRoutes = router;
