import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../lib/pipes/zod-validation.pipe';
import { createProductSchema, type CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async create(@Body() createProductDto: CreateProductDto) {
  
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }
}