import { z } from 'zod';
import { PaymentMethod } from '../entities/payment.entity';

export const CreatePaymentSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a 0'),
  method: z.enum([
    PaymentMethod.CARD,
    PaymentMethod.TRANSFER,
  ], {
    message: 'Método debe ser card o transfer',
  }),
  //fix de uiid definirlo como string
  productId: z.string().check(z.uuid({ message: 'productId debe ser un UUID válido' })),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;