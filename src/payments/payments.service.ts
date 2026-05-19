import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';

// ── Patrón Builder ──────────────────────────────────────────
class PaymentBuilder {
  private payment: Partial<Payment> = {};

  setAmount(amount: number) {
    this.payment.amount = amount;
    return this;
  }

  setMethod(method: PaymentMethod) {
    this.payment.method = method;
    return this;
  }

  setProductIds(ids: string[]) {
  this.payment.productIds = ids;
  return this;
}

  setBuyerId(id: string) {
    this.payment.buyerId = id;
    return this;
  }

  setStatus(status: PaymentStatus) {
    this.payment.status = status;
    return this;
  }

  setStripePaymentIntentId(id: string) {
    this.payment.stripePaymentIntentId = id;
    return this;
  }

  build(): Partial<Payment> {
    return this.payment;
  }
}
// ────────────────────────────────────────────────────────────

@Injectable()
export class PaymentsService {
  private readonly stripe: InstanceType<typeof Stripe>;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
    );
  }

  async create(
    dto: CreatePaymentDto,
    buyerId: string,
  ): Promise<{ payment: Payment; clientSecret: string }> {
    // 1. Crear Payment Intent en Stripe (monto en centavos)
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(dto.amount) * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        productIds: dto.productIds.join(','),
        buyerId,
      },
    });

    // 2. Construir el pago con el Builder
    const paymentData = new PaymentBuilder()
      .setAmount(dto.amount)
      .setMethod(dto.method as PaymentMethod)
      .setProductIds(dto.productIds)
      .setBuyerId(buyerId)
      .setStatus(PaymentStatus.PENDING)
      .setStripePaymentIntentId(paymentIntent.id)
      .build();

    // 3. Guardar en DB
    const payment = await this.paymentsRepository.create(paymentData);

    // 4. Devolver pago + clientSecret para el frontend
    return {
      payment,
      clientSecret: paymentIntent.client_secret!,
    };
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll();
  }

  async findOneById(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOneById(id);
    if (!payment) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
    return payment;
  }

  async getMyPayments(buyerId: string): Promise<Payment[]> {
    return this.paymentsRepository.findByBuyerId(buyerId);
  }

  async getPaymentsByProduct(productId: string): Promise<Payment[]> {
    return this.paymentsRepository.getPaymentsByProduct(productId);
  }

  async updateStatus(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    await this.findOneById(id);
    const updated = await this.paymentsRepository.updateStatus(id, dto.status);
    if (!updated) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
    return updated;
  }

  // ── Webhook de Stripe ──────────────────────────────────────
  async handleStripeWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<void> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret!,
      );
    } catch {
      throw new ForbiddenException('Webhook signature inválida');
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const payments = await this.paymentsRepository.findAll();
        const payment = payments.find(
          (p: Payment) => p.stripePaymentIntentId === intent.id,
        );
        if (payment) {
          await this.paymentsRepository.updateStatus(
            payment.id,
            PaymentStatus.COMPLETED,
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        const allPayments = await this.paymentsRepository.findAll();
        const failedPayment = allPayments.find(
          (p: Payment) => p.stripePaymentIntentId === failedIntent.id,
        );
        if (failedPayment) {
          await this.paymentsRepository.updateStatus(
            failedPayment.id,
            PaymentStatus.FAILED,
          );
        }
        break;
      }
    }
  }
  // ──────────────────────────────────────────────────────────

  async cancel(id: string, buyerId: string): Promise<void> {
    const payment = await this.findOneById(id);

    if (payment.buyerId !== buyerId) {
      throw new ForbiddenException('No puedes cancelar un pago que no es tuyo');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new ForbiddenException(
        'Solo se pueden cancelar pagos en estado pending',
      );
    }

    // Cancelar también en Stripe si tiene Payment Intent
    if (payment.stripePaymentIntentId) {
      await this.stripe.paymentIntents.cancel(payment.stripePaymentIntentId);
    }

    await this.paymentsRepository.delete(id);
  }
}