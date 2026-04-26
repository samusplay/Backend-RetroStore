import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { loginSchema, registerSchema, type LoginDto, type RegisterDto } from './dto/auth.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //metodos para el post
  @Post('register')
  //pipe antes de pasar a la api con zod
  @UsePipes(new ZodValidationPipe(registerSchema))
   async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }
   @Post('login')
   @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
