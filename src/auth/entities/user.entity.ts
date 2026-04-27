import { Product } from '@/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    COLLECTOR = 'COLLECTOR',
    SELLER = 'SELLER',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string; // Guardamos el hash, NUNCA la contraseña en texto plano

    @Column({ type: 'enum', enum: UserRole, default: UserRole.COLLECTOR })
    role!: UserRole;

    @Column({ nullable: true })
    favoriteConsole!: string;

    @Column({ nullable: true })
    storeName!: string; // Solo se llenará si es SELLER

    @CreateDateColumn()
    createdAt!: Date;

    //manejamos una tabla intermediaria
    @ManyToMany(() => Product)
    @JoinTable({
        name: 'user_collection',        // nombre de la tabla intermedia en DB
        joinColumn: { name: 'userId' }, // columna que apunta al usuario
        inverseJoinColumn: { name: 'productId' }, // columna que apunta al producto
    })
    collection!: Product[];
}