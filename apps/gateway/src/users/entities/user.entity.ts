import { BeforeInsert, Column, Entity } from "typeorm";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IsEnum } from "class-validator";

import { CoreEntity } from "../../common/entitites/core.entity";

enum UserRole {
    Owner,
    Client,
    Delivery,
}

registerEnumType(UserRole, { name: "UserRole"});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column()
    email: string;

    @Field(type => String)
    @Column()
    password: string;

    @Field(type => UserRole)
    @Column({ type: "enum", enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}