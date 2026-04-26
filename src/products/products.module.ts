import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  //debemos registrar entidad y repo
  imports:[
    TypeOrmModule.forFeature([Product])

  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository

  ],
})
export class ProductsModule {}
