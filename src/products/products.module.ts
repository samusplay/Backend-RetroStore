import { UserRepository } from '@/auth/auth.repository';
import { User } from '@/auth/entities/user.entity';
import { getJwtConfig } from '@/config/jwt.config';
import { CloudinaryUtil } from '@/utils/cloudinary.util';
import { WikipediaUtil } from '@/utils/wikipedia.util';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  //debemos registrar entidad y repo
  imports:[
    TypeOrmModule.forFeature([Product,User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory:getJwtConfig,
    })

  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    CloudinaryUtil,
    WikipediaUtil,
    UserRepository

  ],
})
export class ProductsModule {}
