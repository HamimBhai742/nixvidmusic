import { Request } from "express";

const chat = async (req: Request) => {
    console.log(req.body.message,req.file)
  console.log("Chat service is running...");
};


export const chatServices = { chat };