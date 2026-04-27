import { User } from '@/auth/entities/user.entity';
import { getJwtConfig } from '@/config/jwt.config';
import { Product } from '@/products/entities/product.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { CollectionRepository } from './collection.repository';
import { CollectionService } from './collection.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Product]),
    // JwtModule para que el JwtGuard pueda verificar el token
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),

  ],
  controllers: [CollectionController],
  providers: [
    CollectionService,
    CollectionRepository
    
  ],
})
export class CollectionModule {}
