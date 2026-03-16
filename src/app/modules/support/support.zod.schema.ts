import { z } from "zod";

export const supportZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z.email("Invalid email address"),

  subject: z.string().min(3, "Subject must be at least 3 characters").max(100),

  category: z.string().min(3, "Category is required"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});
