import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { encodePassword } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User as PrismaUser } from '@prisma/client'; //
import { AuthUserDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

    async signUp(user: PrismaUser) {
        try {
            const newUser = await this.usersService.addUser(user);
            return newUser;
        } catch {
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST)
        }
    }

    async logIn(user: AuthUserDTO) {
        const userByLogin = await this.usersService.findByLogin(user.login);
        const payload = {sub: userByLogin.id, username: userByLogin.login};
        const isValidPassword = await bcrypt.compare(user.password, userByLogin.password);
        console.log(isValidPassword)
     
            if(!isValidPassword) {
                throw new HttpException("Authentication Failed", HttpStatus.FORBIDDEN);
            }
            console.log(payload.username)
            const accessToken = await this.jwtService.signAsync(payload, {
                secret:  process.env.JWT_SECRET_KEY || 'secret123123',
                expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
            })
            return {accessToken: accessToken}
    }
}
