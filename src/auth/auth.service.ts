import { comparePasswords, hashPassword } from '@/utils/hash.util';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        //generador del jwt
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, ...rest } = registerDto;

        // 1. Verificar si existe usando el método limpio
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('El correo ya está registrado en la bóveda.');
        }
        //encriptamos
        const passwordHash = await hashPassword(password);

        //guardamos en la base de datos
        const newUser = await this.userRepository.createUser({
            ...rest,
            email,
            passwordHash,
            role: rest.role as UserRole
        });
        //retornamos la entidad
        const { passwordHash: _, ...userResponse } = newUser;
        //aqui ira el jwt
        return userResponse
    }
    async login(loginDto: LoginDto) {
        //extraemos
        const { email, password } = loginDto;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestException('Credenciales inválidas');
        }
        //comparamos el hash
        const isPasswordValid = await comparePasswords(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        //generamos el token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        const { passwordHash: _, ...userResponse } = user;

        return{
            accessToken,
            user: userResponse
        }


    }
}
