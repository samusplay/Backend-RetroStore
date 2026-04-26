import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository {
    //constrctor del repo
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    //encontrar por email
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }
    //busca por nombre
    async findByUsername(username: string): Promise<User | null> {
        return this.repository.findOne({ where: { username } });
    }

    //crear usuario
    async createUser(userData: Partial<User>): Promise<User> {
        const newUser = this.repository.create(userData);
        return this.repository.save(newUser);
    }

}