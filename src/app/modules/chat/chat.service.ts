import axios from "axios";
import { Request } from "express";
import { prisma } from "../../utils/prisma";

const createChat = async (userId: string) => {
  const chat = await prisma.chat.create({
    data: {
      userId,
    },
  });
  return chat;
};

const chat = async (req: Request & { user?: any }) => {
  console.log(req.body);
  console.log("Chat service is running...");
  const data = {
    userId: req.user?.userId,
    ...req.body,
  };
  await prisma.chatMessage.create({
    data: {
      chatId: data?.chat_id,
      content: data?.user_asked_question,
      userId: req.user?.userId,
      role: "USER",
    },
  });
  const res = await axios.post("http://206.162.244.175:8003/chatbot/ask", data);
  console.log(res);

  if (res.data) {
    const { answer } = res.data;
    await prisma.chatMessage.create({
      data: {
        chatId: data?.chat_id,
        content: answer,
        userId: req.user?.userId,
        role: "ASSISTANT",
      },
    });
  }
  return res.data;
};

const getMyChat = async (chatId: string, userId: string) => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      userId,
    },
    include:{
      messages: true
    }
  });
  return chat;
};

export const chatServices = { chat, createChat , getMyChat};
