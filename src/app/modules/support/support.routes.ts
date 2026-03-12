import { Router } from "express";
import { supportController } from "./support.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post("/create-ticket", supportController.createSupportTicket);
router.post(
  "/closed-ticket",
  checkAuth(Role.ADMIN),
  supportController.closedSupportTicket,
);

router.get(
  "/all-tickets",
  checkAuth(Role.ADMIN),
  supportController.getAllSupportTicket,
);

export const supportRoutes = router;
