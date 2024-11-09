import { Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/utils/interfaces';
import { CreateUserDto } from 'src/utils/interfaces.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UsersController {
    // no additional fields!!!

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
    updateUserPassword(@Param('id') id: string, @Body() updatedUserPassword: UpdatePasswordDto) {
        return this.usersService.updateUserPassword(id, updatedUserPassword);
    }

    @Delete(':id')
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
