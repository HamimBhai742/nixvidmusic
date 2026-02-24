export interface ISupport {
    name: string;
    email: string;
    message: string;
    category: string;
    subject: string;
}

export enum TicketStatus {
  OPEN,
  IN_PROGRESS,
  RESOLVED,
  CLOSED
}

export enum SupportCategory {
  GENERAL_INQUIRY,
  TECHNICAL_ISSUE,
  BILLING_PAYMENTS,
  ACCOUNT_ACCESS,
  FEATURE_REQUEST,
  OTHER
}

export interface ISupportTicket {
  id: string;
  name: string;
  email: string;

  category: SupportCategory;
  subject: string;
  message: string;

  status: TicketStatus;

  createdAt: Date;
  updatedAt: Date;
}