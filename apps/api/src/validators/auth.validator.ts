import { z } from 'zod';

export const loginBodySchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
