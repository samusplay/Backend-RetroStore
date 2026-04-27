import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CollectionRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  // Trae la colección del usuario con solo los campos necesarios
  async findCollection(userId: string): Promise<Product[]> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['collection'], // carga la relación ManyToMany
    });
    return user?.collection ?? [];
  }

  // Agrega un producto a la colección
  async addProduct(user: User, product: Product): Promise<void> {
    // Si no tiene colección inicializamos el array
    if (!user.collection) user.collection = [];
    user.collection.push(product);
    await this.repository.save(user);
  }

  // Quita un producto de la colección
  async removeProduct(user: User, product: Product): Promise<void> {
    user.collection = user.collection.filter(p => p.id !== product.id);
    await this.repository.save(user);
  }
}