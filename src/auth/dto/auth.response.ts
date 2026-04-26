import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(['COLLECTOR', 'SELLER']),
  favoriteConsole: z.string(),
  storeName: z.string().optional(),
  createdAt: z.date().optional(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: userResponseSchema,
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;