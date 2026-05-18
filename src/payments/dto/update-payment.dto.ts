import { z } from 'zod';
import { PaymentStatus } from '../entities/payment.entity';

//arreglo de verion de zod no actualizar
export const UpdatePaymentSchema = z.object({
  status: z.enum([
    PaymentStatus.PENDING,
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
  ], {
    message: 'Status debe ser pending, completed o failed',
  }),
});

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;