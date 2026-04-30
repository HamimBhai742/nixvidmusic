import { Router } from "express";
import { upload } from "../../middleware/upload";
import { chatController } from "./chat.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post("/create-chat", checkAuth(Role.USER), chatController.createChat);

router.post("/ask-question", checkAuth(Role.USER), chatController.chat);

router.get("/get-my-chats/:chatId", checkAuth(Role.USER), chatController.getMyChat);

router.get("/chat-history", checkAuth(Role.USER), chatController.chatHistory);

router.delete("/delete-chat/:chatId", checkAuth(Role.USER), chatController.deleteChat);

export const chatRoutes = router;
