import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
    //inyectamos el repo 
    constructor(
        private readonly productsRepository: ProductRepository
    ) { }

    //metodos
    async create(createProductDto: CreateProductDto) {
        //podemos agregar mas logica
        return await this.productsRepository.createProduct(createProductDto);

    }

    async findAll(){
        return await this.productsRepository.findAllProducts();
    }
}
