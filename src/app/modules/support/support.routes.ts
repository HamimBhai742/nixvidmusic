import { Router } from "express";
import { supportController } from "./support.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";
import { validateRequest } from "../../middleware/validationRequest";
import { supportZodSchema } from "./support.zod.schema";

const router = Router();

router.post(
  "/create-ticket",
  validateRequest(supportZodSchema),
  supportController.createSupportTicket,
);
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
