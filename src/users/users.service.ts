import { Body, Get, HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'src/utils/interfaces';
import { CreateUserDto } from 'src/utils/interfaces.dto';

@Injectable()
export class UsersService {
    users: User[] = [];

    @Get()
    findAll() {
        return this.users;
    }

    @Get()
    findUserById(id: string) {
        const UUIDRegEx = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const user = this.users.find((user) => user.id === id);
        if (user && UUIDRegEx.test(id)) {
            return user;
        } else if (!user && UUIDRegEx.test(id)) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND)
        } else {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
        }
    }

    @Post()
    addUser(@Body() user: CreateUserDto): User {
        const id = randomUUID();
        const version: number = 1;
        const createdAt: number = new Date().getMilliseconds();
        let updatedAt: number = new Date().getMilliseconds();
        const newUser = { id, ...user, version, createdAt, updatedAt };
        if (!user.login || !user.password) {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        } else {
            this.users.push(newUser);
        }

        return newUser;
    }
}
