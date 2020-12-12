import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateAccountDto, CreateAccountOutput } from "./dto/create-account.dto";
import { LoginDto, LoginOutput } from "./dto/login.dto";

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(returns => User)
    me() {
        const user = new User()
        user.email  = 'abc@gmail.com'
        return user
    }

    @Mutation(returns => LoginOutput)
    async login(@Args("input") loginDto: LoginDto): Promise<LoginOutput> {
        try {
            return await this.usersService.login(loginDto);
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }
}