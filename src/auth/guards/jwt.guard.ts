import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // lo adjuntamos al request
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}