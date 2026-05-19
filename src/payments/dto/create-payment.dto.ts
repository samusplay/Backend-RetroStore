import { z } from 'zod';
import { PaymentMethod } from '../entities/payment.entity';

export const CreatePaymentSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  method: z.enum([PaymentMethod.CARD, PaymentMethod.TRANSFER], {
    message: 'Método debe ser card o transfer',
  }),
  productIds: z
    .array(z.string().check(z.uuid({ message: 'Cada productId debe ser un UUID válido' })))
    .min(1, 'Debe incluir al menos un producto'),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;