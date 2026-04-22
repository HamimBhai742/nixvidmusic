import { Router } from "express";
import { chatController } from "./chat.controller";
import { upload } from "../../middleware/upload";
import { validateRequest } from "../../middleware/validationRequest";
import { chatZodSchema } from "./chat.zod.schema";

const router = Router();

router.post(
  "/create-conversation",
  upload.single("file"),
  validateRequest(chatZodSchema),
  chatController.chat,
);

export const chatRoutes = router;
