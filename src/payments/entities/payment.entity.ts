import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CARD = 'card',
  TRANSFER = 'transfer',
}
//Correcion  ! se debe utilizar para que typescript infiera
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  method!: PaymentMethod;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'uuid' })
  buyerId!: string;

  //campo para usar la pasarela de stripe
  @Column({ type: 'varchar', nullable: true, name: 'stripe_payment_intent_id' })
  stripePaymentIntentId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}