import z from "zod";

export const userZodSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters').max(20,'Name must be at most 20 characters'),
    email: z.email(),
    password: z.string().min(8,'Password must be at least 8 characters').max(30,'Password must be at most 30 characters'),
});


export const resendOtpSchema = z.object({
    email: z.email()
});

export const verifyOtpSchema = z.object({
    otp: z.string().min(5,'OTP must be 5 digits').max(5,'OTP must be 5 digits'),
    email: z.email(),
    token: z.string()
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8,'Password must be at least 8 characters').max(30,'Password must be at most 30 characters'),
    token: z.string(),
    email: z.email()
});

export const verifyRegisterOTPSchema = z.object({
    otp: z.string().min(5,'OTP must be 5 digits').max(5,'OTP must be 5 digits'),
    email: z.email()
});