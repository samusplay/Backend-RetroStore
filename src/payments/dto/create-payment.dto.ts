import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  method: z.enum(['card', 'transfer'] as const, {
    message: 'Método debe ser card o transfer',
  }),
  productId: z.string().uuid('productId debe ser un UUID válido'),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
