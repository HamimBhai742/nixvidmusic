import z from "zod";

export const authZodSchema = z.object({
    email: z.email(),
    password: z.string().min(8,'Password must be at least 8 characters').max(30,'Password must be at most 30 characters')
}); 

export const verifyOtpSchema = z.object({
    otp: z.string().min(5,'OTP must be 5 digits').max(5,'OTP must be 5 digits'),
    email: z.email()
});


export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8,'Password must be at least 8 characters').max(30,'Password must be at most 30 characters'),
    newPassword: z.string().min(8,'Password must be at least 8 characters').max(30,'Password must be at most 30 characters')
});