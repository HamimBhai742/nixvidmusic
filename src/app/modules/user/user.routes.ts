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
import { upload } from "../../middleware/upload";

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

router.patch(
  "/update-profile-photo",
  checkAuth(Role.USER),
  upload.single("file"),
  userController.profilePhotoUpdate,
);

router.post("/resend-register-otp", userController.resendRegisterOTP);

router.get(
  "/all-users",
  userController.getAllUsers,
);

export const userRoutes = router;
