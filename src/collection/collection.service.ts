import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CollectionRepository } from './collection.repository';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,

    // Necesitamos el repo de User para buscar el usuario completo con su colección
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // Necesitamos el repo de Product para verificar que el producto existe
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Trae la colección del usuario autenticado
  async getCollection(userId: string) {
    const products = await this.collectionRepository.findCollection(userId);

    // Devolvemos solo los campos necesarios igual que el catálogo
    return products.map(p => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      price: Number(p.price),
    }));
  }

  async addProduct(userId: string, productId: string) {
    // Buscamos el usuario con su colección actual
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['collection'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Verificamos que el producto existe
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    // Verificamos que no esté ya en la colección para no duplicar
    const alreadyInCollection = user.collection?.some(p => p.id === productId);
    if (alreadyInCollection) return { message: 'El producto ya está en tu colección' };

    await this.collectionRepository.addProduct(user, product);
    return { message: 'Producto agregado a tu colección' };
  }

  async removeProduct(userId: string, productId: string) {
    //hace la consulta
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['collection'],
  });
  if (!user) throw new NotFoundException('Usuario no encontrado');

  const inCollection = user.collection?.some(p => p.id === productId);
  if (!inCollection) return { message: 'El producto no está en tu colección' };

  // Buscamos el producto igual que en addProduct ← faltaba esto
  const product = await this.productRepository.findOne({
    where: { id: productId },
  });
  if (!product) throw new NotFoundException('Producto no encontrado');

  await this.collectionRepository.removeProduct(user, product);
  return { message: 'Producto eliminado de tu colección' };
}
}