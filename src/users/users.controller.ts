import { Body, Controller, Get, Header, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/utils/interfaces';
import { CreateUserDto } from 'src/utils/interfaces.dto';

// const a = new DataBaseStore();

@Controller('user')
export class UsersController {
    // GET 
    // /user +
    // /user/:id (id: uuid) +
    // POST
    // /user
    //  PUT
    // /user/:id (id: uuid)
    // DELETE
    // /user/:id

    constructor(private readonly usersService: UsersService) {

    }

    @Get()
    @Header("Content-Type", "application/json")
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Header("Content-Type", "application/json")
    findById(@Param('id') id: string) {
     return this.usersService.findUserById(id);
    }

    @Post()
    addUser(@Body() user: CreateUserDto): User{
        return this.usersService.addUser(user);
    }
}
