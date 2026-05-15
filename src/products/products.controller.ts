import {
  BadRequestException,
  Body, Controller, Get, Param, Patch, Post, // Añadimos Patch
  Query,
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
import { updateProductSchema, type UpdateProductDto } from './dto/update-product.dto'; // Importamos el esquema y DTO de update
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
    if (!image) {
      throw new BadRequestException('La imagen es obligatoria');
    }
    return await this.productsService.create(createProductDto, image, seller);
  }

  @Get()
  async findAll(@Query('category') category?: string): Promise<ProductCatalogResponseDto[]> {
    return await this.productsService.findAll(category);
  }

  //  my-products DEBE ir estrictamente antes que :id
  // Si estuviera debajo, NestJS pensaría que "my-products" es un ID de producto.
  @Get('inventory')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SELLER')
  async findMyProducts(@CurrentUser() seller: any): Promise<any[]> {
    return await this.productsService.findMyProducts(seller);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDetailResponseDto> {
    return await this.productsService.findById(id);
  }

  //  ACTUALIZAR PRODUCTO
  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SELLER')
  async updateProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) updateProductDto: UpdateProductDto,
    @CurrentUser() seller: any,
  ): Promise<{ message: string }> {
    return await this.productsService.updateProduct(id, updateProductDto, seller);
  }

  //  DESACTIVAR PRODUCTO
  @Patch(':id/deactivate')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SELLER')
  async deactivateProduct(
    @Param('id') id: string,
    @CurrentUser() seller: any,
  ): Promise<{ message: string }> {
    return await this.productsService.deactivateProduct(id, seller);
  }

  // ✅ ACTIVAR PRODUCTO
  @Patch(':id/activate')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('SELLER')
  async activateProduct(
    @Param('id') id: string,
    @CurrentUser() seller: any,
  ): Promise<{ message: string }> {
    return await this.productsService.activateProduct(id, seller);
  }
}