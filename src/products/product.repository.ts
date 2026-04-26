import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./entities/product.entity";


@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.repository.create(createProductDto);
        return await this.repository.save(product);
    }

    //metodo asincronico para encontrar todos los productos
    async findAllProducts(): Promise<Product[]> {
        return await this.repository.find();
    }




}