import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { encodePassword } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

    async signUp(user: CreateUserDTO) {
        try {
            const newUser = await this.usersService.addUser(user);
            return newUser;
        } catch {
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST)
        }
    }

    async logIn(login: string, pass: string) {
        const user =  await this.usersService.findByLogin(login);
        const encodedPassword = encodePassword(pass);
        try {
            if(user.password !== encodedPassword) {
                throw new HttpException("Authentication Failed", HttpStatus.FORBIDDEN);
            }
            const payload = {sub: user.id, login: user.login};
            return {access_token: await this.jwtService.signAsync(payload)}
            
        } catch {
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
        }


    }
}
