import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Condition, Product } from "./entities/product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    imageUrl: string,
    trivia: string,
    seller: User,
  ): Promise<Product> {
    try {
      const product = this.repository.create({
        ...createProductDto,
        condition: createProductDto.condition as Condition,
        imageUrl,
        trivia,
        seller,
      });
      return await this.repository.save(product);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('El código del producto ya existe');
      }
      throw error;
    }
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.repository.find();
  }
}