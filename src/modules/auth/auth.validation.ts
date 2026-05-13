import * as z from "zod";

export const registerSchema = z.object({
  companyName: z.string().min(3),
  companyEmail: z.email(),

  companyAddress: z.string().optional(),
  companyPhone: z
    .string()
    .regex(/^\+?[0-9]+$/)
    .optional(),
  adminName: z.string().min(3),
  adminEmail: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  userEmail: z.email(),
  password: z.string(),
});
export const forgotPasswordSchema = z.object({
  email: z.email(),
});
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});
export const resetPasswordInputSchema = z.object({
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
