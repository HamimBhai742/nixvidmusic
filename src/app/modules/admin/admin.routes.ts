import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { adminController } from "./admin.controller";

const router = Router();

// User Management (Admin)
router.get(
  "/admin/users/overview",
  checkAuth("ADMIN", "SUPERADMIN"),
  adminController.getUserManagementOverview,
);

router.get(
  "/admin/users/recent-activity",
  checkAuth("ADMIN", "SUPERADMIN"),
  adminController.getRecentUserActivity,
);

export const adminRoutes = router;

