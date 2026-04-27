//import { User } from '@/users/entities/user.entity';
import { User } from '@/auth/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum Condition {
  NUEVO = 'NUEVO',
  USADO = 'USADO',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 100 })
  platform!: string;

  @Column({ type: 'enum', enum: Condition, default: Condition.USADO })
  condition!: Condition;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  trivia?: string;

  //vinculamos al usuario
  @ManyToOne(() => User, { eager: true })
  seller!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}