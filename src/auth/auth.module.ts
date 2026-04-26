import { getJwtConfig } from '@/config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

@Module({
  imports:[
    //Registramos la entidad
    TypeOrmModule.forFeature([User]),
    //registramos el jwt
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory:getJwtConfig,
    })

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository

  ],
})
export class AuthModule {}
