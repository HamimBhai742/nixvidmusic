import z from "zod";

export const userZodSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters').max(20,'Name must be at most 20 characters'),
    email: z.email(),
    password: z.string().min(6,'Password must be at least 6 characters').max(20,'Password must be at most 20 characters'),
});


export const resendOtpSchema = z.object({
    email: z.email()
});

export const verifyOtpSchema = z.object({
    otp: z.string().min(6,'OTP must be 6 digits').max(6,'OTP must be 6 digits'),
    email: z.email(),
    token: z.string()
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6,'Password must be at least 6 characters').max(20,'Password must be at most 20 characters'),
    token: z.string(),
    email: z.email()
});