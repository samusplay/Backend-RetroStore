import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async create(data: Partial<Payment>): Promise<Payment> {
    const payment = this.repo.create(data);
    return this.repo.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOneById(id: string): Promise<Payment | null> {
    return this.repo.findOneBy({ id });
  }

  async findByBuyerId(buyerId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { buyerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductId(productId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    await this.repo.update(id, { status });
    return this.findOneById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
