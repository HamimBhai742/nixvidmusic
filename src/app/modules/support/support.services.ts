
import httpStatus from "http-status";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error/AppError";
import { ISupportTicket } from "../../interface/support.interface";

const createSupportTicket = async (
  payload: ISupportTicket,
) => {
  const { name, email, message, category, subject } = payload;
  const ticket = await prisma.supportTicket.create({
    data: {
      name,
      email,
      message,
      category,
      subject,
    },
  });

  if (!ticket)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to create support ticket",
    );
  await otpQueueEmail.add("adminSupport", {
    adminEmail: "mdhamim5088@gmail.com",
    ticket,
  });

  await otpQueueEmail.add("autoReplySupport", {
    userEmail: email,
    userName: name,
    ticketId: ticket.id,
  });
  return {
    message: "Ticket created successfully",
  };
};

const closedSupportTicket = async (
  ticketId: string,
  payload: Partial<ISupportTicket>,
) => {
  const ticket = await prisma.supportTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: payload.status,
    },
  });

  if (!ticket)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update support ticket",
    );

  await otpQueueEmail.add("supportTicketClosed", {
    userEmail: ticket.email,
    userName: ticket.name,
    ticketId: ticket.id,
  });
  return {
    message: "Ticket closed successfully",
  };
};

export const supportService = {
  createSupportTicket,
  closedSupportTicket,
};
