import { IsNotEmpty, IsString } from "class-validator";

export class AuthUserDTO {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}