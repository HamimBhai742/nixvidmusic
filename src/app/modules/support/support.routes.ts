import { Router } from "express";
import { supportController } from "./support.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRoleEnum } from "@prisma/client";

const router = Router();

router.post("/create-ticket", supportController.createSupportTicket);
router.post(
  "/closed-ticket",
  checkAuth(UserRoleEnum.ADMIN),
  supportController.closedSupportTicket,
);

export const supportRoutes = router;
