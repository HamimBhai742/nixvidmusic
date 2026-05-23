import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { redeemCodeController } from "./redeemCode.controller";
import {
  generateRedeemCodesSchema,
  validateRedeemCodeSchema,
  applyRedeemCodeSchema,
  useScanSchema,
} from "./redeemCode.zod.schema";

const router = Router();

// ==========================================
// USER ROUTES (Public or authenticated)
// ==========================================

// Validate redeem code (Public)
router.post(
  "/redeem/validate",
  validateRequest(validateRedeemCodeSchema),
  redeemCodeController.validateRedeemCode
);

// Apply/redeem code (Auth required)
router.post(
  "/redeem/apply",
  checkAuth("USER", "ADMIN", "SUPERADMIN"),
  validateRequest(applyRedeemCodeSchema),
  redeemCodeController.applyRedeemCode
);

// Get current user access status (Auth required)
router.get(
  "/me/access-status",
  checkAuth("USER", "ADMIN", "SUPERADMIN"),
  redeemCodeController.getUserAccessStatus
);

// Use one scan/access (Auth required)
router.post(
  "/scans/use",
  checkAuth("USER", "ADMIN", "SUPERADMIN"),
  validateRequest(useScanSchema),
  redeemCodeController.useScan
);

// Get scan usage history (Auth required)
router.get(
  "/scans/history",
  checkAuth("USER", "ADMIN", "SUPERADMIN"),
  redeemCodeController.getScanUsageHistory
);

// ==========================================
// ADMIN ROUTES (Protected with ADMIN/SUPERADMIN roles)
// ==========================================

// Dashboard overview cards + recent redeem activity
router.get(
  "/admin/dashboard-overview",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getAdminDashboardOverview
);

// Redeem codes page cards (active/redemptions/avg lifespan/expired)
router.get(
  "/admin/redeem-codes/overview",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getAdminRedeemCodesOverview
);

// List batches
router.get(
  "/admin/redeem-code-batches",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getAllBatches
);

// Get batch details
router.get(
  "/admin/redeem-code-batches/:batchId",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getBatchDetails
);

// Export redeem codes as CSV (Place before /admin/redeem-codes/:id to avoid collisions)
router.get(
  "/admin/redeem-codes/export",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.exportRedeemCodesCsv
);

// Generate redeem codes
router.post(
  "/admin/redeem-codes/generate",
  checkAuth("ADMIN", "SUPERADMIN"),
  validateRequest(generateRedeemCodesSchema),
  redeemCodeController.generateRedeemCodes
);

// List redeem codes
router.get(
  "/admin/redeem-codes",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getAllRedeemCodes
);

// Get single redeem code details
router.get(
  "/admin/redeem-codes/:id",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.getRedeemCodeById
);

// Disable redeem code
router.patch(
  "/admin/redeem-codes/:id/disable",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.disableRedeemCode
);

// Enable redeem code
router.patch(
  "/admin/redeem-codes/:id/enable",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.enableRedeemCode
);

// Delete redeem code
router.delete(
  "/admin/redeem-codes/:id",
  checkAuth("ADMIN", "SUPERADMIN"),
  redeemCodeController.deleteRedeemCode
);

export const redeemCodeRoutes = router;
