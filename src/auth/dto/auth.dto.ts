import z from 'zod';
import { UserRole } from '../entities/user.entity';

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.email({ message: 'Debe ser un correo válido' }),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
  favoriteConsole: z.string().min(1),
  storeName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;