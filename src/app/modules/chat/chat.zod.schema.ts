import z from "zod";

export const chatZodSchema = z.object({
  message: z.string().min(1, "Message is required"),
  file: z
    .any()
    .refine((file) => file instanceof Buffer, {
      message: "File must be a buffer",
    })
    .optional(),
});
