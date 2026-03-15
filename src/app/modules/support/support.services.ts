import httpStatus from "http-status";
import { prisma } from "../../utils/prisma";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error/AppError";
import { ISupportTicket } from "../../interface/support.interface";
import { Prisma, TicketStatus } from "../../../generated/prisma";

const createSupportTicket = async (
  payload: Prisma.SupportTicketCreateInput,
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
  status: Partial<TicketStatus>,
) => {
  const ticket = await prisma.supportTicket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: status,
    },
  });

  //when ticket is closed after delete the ticket

  await prisma.supportTicket.delete({ where: { id: ticketId } });

  await otpQueueEmail.add("supportTicketClosed", {
    userEmail: ticket.email,
    userName: ticket.name,
    ticketId: ticket.id,
  });
  return {
    message: "Ticket closed successfully",
  };
};

const getAllSupportTickets = async () => {
  const tickets = await prisma.supportTicket.findMany();
  return tickets;
};

export const supportService = {
  createSupportTicket,
  closedSupportTicket,
  getAllSupportTickets,
};
