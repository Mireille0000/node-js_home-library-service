import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {User as PrismaUser} from '@prisma/client'
import { User } from 'src/utils/interfaces';
// import { CreateUserDto } from 'src/utils/interfaces.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDTO } from './dto/create-user.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/decorator';

@Controller('user')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async addUser(@Body() user: PrismaUser) {
    return await this.usersService.addUser(user);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updatedUserPassword: UpdatePasswordDto,
  ) {
    return await this.usersService.updateUserPassword(id, updatedUserPassword);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
