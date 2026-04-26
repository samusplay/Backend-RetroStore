import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    // Agregamos "as any" para silenciar el error estricto de TypeScript
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
  },
});