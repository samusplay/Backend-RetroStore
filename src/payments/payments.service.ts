import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';

class PaymentBuilder {
  private payment: Partial<Payment> = {};

  setAmount(amount: number) {
    this.payment.amount = amount;
    return this;
  }

  //Fix seteamos el Paymentod
  setMethod(method: PaymentMethod) {
    this.payment.method = method;
    return this;
  }

  setProductId(id: string) {
    this.payment.productId = id;
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

  build(): Partial<Payment> {
    return this.payment as Payment;
  }
}

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) { }

  //aplicado patron Builder
  async create(dto: CreatePaymentDto, buyerId: string): Promise<Payment> {
    const paymentData = new PaymentBuilder()
      .setAmount(dto.amount)
      .setMethod(dto.method)
      .setProductId(dto.productId)
      .setBuyerId(buyerId)
      .setStatus(PaymentStatus.PENDING)
      .build();
    return this.paymentsRepository.create(paymentData);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll();
  }
  //encontrar pago con id
  async findOneById(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOneById(id);
    if (!payment) throw new NotFoundException(`Pago con id ${id} no encontrado`);
    return payment;
  }

  //Obtener todos Mis pagos
  async getMyPayments(buyerId: string): Promise<Payment[]> {
    return this.paymentsRepository.findByBuyerId(buyerId);
  }

  async getPaymentsByProduct(productId: string): Promise<Payment[]> {
    return this.paymentsRepository.findByProductId(productId);
  }

  async updateStatus(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    await this.findOneById(id);
    const updated = await this.paymentsRepository.updateStatus(id, dto.status);
    if (!updated) throw new NotFoundException(`Pago con id ${id} no encontrado`);
    return updated;
  }

  //cancelar Pago
  async cancel(id: string, buyerId: string): Promise<void> {
    const payment = await this.findOneById(id);
    if (payment.buyerId !== buyerId) {
      throw new ForbiddenException('No puedes cancelar un pago que no es tuyo');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new ForbiddenException('Solo se pueden cancelar pagos en estado pending');
    }
    await this.paymentsRepository.delete(id);
  }
}
