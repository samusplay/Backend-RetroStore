import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import { getDatabaseConfig } from './config/database.config';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>getDatabaseConfig(configService)
    }),
    ProductsModule,
    AuthModule,
    CollectionModule,
    PaymentsModule
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger('Database');

  onModuleInit() {
    this.logger.log(
      '\x1b[36m🐘 Base de datos PostgreSQL conectada exitosamente\x1b[0m',
    );
  }
}
