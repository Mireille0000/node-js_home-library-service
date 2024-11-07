import { Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/utils/interfaces';
import { CreateUserDto, UpdatePasswordDto } from 'src/utils/interfaces.dto';

// const a = new DataBaseStore();

@Controller('user')
export class UsersController {
    // GET 
    // /user +
    // /user/:id (id: uuid) +
    // POST
    // /user +
    // error handling +-
    //  PUT
    // /user/:id (id: uuid) +
    // error handling
    // DELETE
    // /user/:id

    // no additional fields

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
    @Header("Content-Type", "application/json")
    @HttpCode(201)
    addUser(@Body() user: CreateUserDto): Partial<User>{
        return this.usersService.addUser(user);
    }

    @Put(':id')
    @Header("Content-Type", "application/json")
    updateUserInfo(@Param('id') id: string, @Body() updatedUserPassword: UpdatePasswordDto) {
        return this.usersService.updateUserInfo(id, updatedUserPassword);
    }

    @Delete(':id')
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
