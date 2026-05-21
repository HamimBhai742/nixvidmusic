import { Router } from "express";
import { contractController } from "./contract.controller";
import { upload } from "../../middleware/upload";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post(
  "/create-contract",
  checkAuth(Role.USER),
  upload.single("file"),
  contractController.contractAnalysis,
);

router.get(
  "/recent-contracts",
  checkAuth(Role.USER),
  contractController.getRecentContracts,
);

router.get(
  "/all-contracts",
  checkAuth(Role.USER),
  contractController.getAllContracts,
);

router.get(
  "/total-contracts",
  checkAuth(Role.USER),
  contractController.totalContracts,
);

router.get(
  "/high-risk-contracts",
  checkAuth(Role.USER),
  contractController.highRiskContracts,
);

router.get(
  "/medium-risk-contracts",
  checkAuth(Role.USER),
  contractController.mediumRiskContracts,
);

router.get(
  "/low-risk-contracts",
  checkAuth(Role.USER),
  contractController.lowRiskContracts,
);

router.get(
  "/:id",
  checkAuth(Role.USER),
  contractController.getMyContract,
);

export const contractRoutes = router;
