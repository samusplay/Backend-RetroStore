import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}