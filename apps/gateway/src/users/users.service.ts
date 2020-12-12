import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    async login({ email, password }: LoginDto): Promise<{ ok: boolean, error?: string; token?: string }> {
        try {
            const user = new User()
            user.id = 1

            return {
                ok: true,
                token: this.jwtService.sign(user.id),
            };
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }

    async findById(id: number): Promise<User> {
        const user = new User()
        user.id = id
        return new User()
    }
}