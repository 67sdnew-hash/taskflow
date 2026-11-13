import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Please provide a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(100, { message: 'Full name cannot exceed 100 characters.' }),
    email: z.string().trim().email({ message: 'Please provide a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
