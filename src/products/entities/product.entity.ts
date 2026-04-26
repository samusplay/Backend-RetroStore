import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 150 })
    name!: string

    @Column({ type: 'varchar', length: 50, unique: true })
    code!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'varchar', nullable: true })
    imageId?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}