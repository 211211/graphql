import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { join } from "path";

import { UsersModule } from "./users/users.module";
import { CommonModule } from "./common/common.module";
import { JwtModule } from "./jwt/jwt.module";
import { JwtMiddleware } from "./jwt/jwt.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid("development", "production").required(),
                TOKEN_SECRET: Joi.string().required(),
            }),
        }),
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), "schema.gql"),
        }),
        JwtModule.forRoot({
            privateKey:  process.env.TOKEN_SECRET,
        }),
        UsersModule,
        CommonModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(JwtMiddleware).forRoutes({
            path: "/graphql",
            method: RequestMethod.ALL,
        });
    }
}
