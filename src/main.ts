import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { v2 as cloudinary } from 'cloudinary';
import { AppModule } from './app.module';
import { getCorsOptions } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('APP_PORT') || 4000;
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  app.enableCors(getCorsOptions(frontendUrl));

  // Verificamos conexión con Cloudinary antes de levantar
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });

  const pingResult = await cloudinary.api.ping();
  if (pingResult.status === 'ok') {
    logger.log('\x1b[32m Cloudinary conectado correctamente \x1b[0m');
  }

  await app.listen(port);
  logger.log('\x1b[36m Backend Retro-store corriendo en puerto: ' + port + '\x1b[0m');
}
bootstrap();