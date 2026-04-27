import {
  Body, Controller, Get, Param, Post,
  UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ZodValidationPipe } from '../lib/pipes/zod-validation.pipe';
import { createProductSchema, type CreateProductDto } from './dto/create-product.dto';
import type { CreateProductResponseDto } from './dto/create-response';
import { ProductCatalogResponseDto, ProductDetailResponseDto } from './dto/product.response';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //Patron de diseño decorators
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SELLER')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new ZodValidationPipe(createProductSchema)) createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() seller: any,
  ): Promise<CreateProductResponseDto> {
    return await this.productsService.create(createProductDto, image, seller);
  }

  @Get()
  async findAll(): Promise<ProductCatalogResponseDto[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDetailResponseDto> {
    return await this.productsService.findById(id);
  }

}