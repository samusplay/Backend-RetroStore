import { z } from 'zod';
import { PaymentStatus } from '../entities/payment.entity';

export const UpdatePaymentSchema = z.object({
  status: z.nativeEnum(PaymentStatus, {
    message: 'Status debe ser pending, completed o failed',
  }),
});

export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;
