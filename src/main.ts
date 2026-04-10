import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsOptions } from './config/cors.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //servicio de configuracion de cors
  const configService = app.get(ConfigService);

  const logger=new Logger('Bootstrap');

  //lee variables de entorno
  const port = configService.get<number>('APP_PORT') || 4000;
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  
  //pasamos la variable de cors
  app.enableCors(getCorsOptions(frontendUrl));

  //levantamos el servidor
  await app.listen(port);
  logger.log('\x1b[36m Backend Retro-store corriendo en puerto: ' + port + '\x1b[0m')
}
bootstrap();
