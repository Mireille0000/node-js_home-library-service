import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('signup')
    @HttpCode(201)
    async signUp(@Body() createUserAuth: CreateUserDTO){
        console.log("signup");
        return await this.authService.signUp(createUserAuth);
    }

    @Post('login')
    async logIn(@Body() user: AuthUserDTO) {
        console.log("login");
        return await this.authService.logIn(user.login, user.password);
    }
}
