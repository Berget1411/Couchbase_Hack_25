import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  otp: z
    .string({ message: "OTP must contain 6 digits" })
    .min(6, { message: "OTP must contain 6 digits" })
    .max(6, { message: "OTP must contain 6 digits" })
    .refine((val) => /^\d+$/.test(val), {
      message: "OTP must contain only digits",
    }),
});

export type OtpSchema = z.infer<typeof otpSchema>;
