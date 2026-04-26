import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    //se registran para que nest sepa que herramientas va utilizar
    ConfigModule.forRoot({
      isGlobal:true
    }),
    //se conecta a la Db de manera asincronica
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>getDatabaseConfig(configService)
    }),
    ProductsModule,
    AuthModule,
   
  ],
  controllers: [],
  providers: [],
})
//aplicamos un ciclo de vida
export class AppModule implements OnModuleInit{
  private readonly logger=new Logger('Database')

  onModuleInit() {
    this.logger.log('\x1b[36m🐘 Base de datos PostgreSQL conectada exitosamente\x1b[0m')
  }
}
