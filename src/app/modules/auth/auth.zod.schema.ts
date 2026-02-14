import z from "zod";

export const authZodSchema = z.object({
    email: z.email(),
    password: z.string().min(6,'Password must be at least 6 characters').max(20,'Password must be at most 20 characters')
}); 

export const verifyOtpSchema = z.object({
    otp: z.string().min(6,'OTP must be 6 digits').max(6,'OTP must be 6 digits'),
    email: z.email()
});


export const changePasswordSchema = z.object({
    oldPassword: z.string().min(6,'Password must be at least 6 characters').max(20,'Password must be at most 20 characters'),
    newPassword: z.string().min(6,'Password must be at least 6 characters').max(20,'Password must be at most 20 characters')
});