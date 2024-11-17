import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'src/utils/interfaces';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'nestjs-prisma';
// import * as database from '../database/db';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService){}

  users: Array<User> = [];

  async findAll() { 
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        password: false,
        version: true,
        createdAt: true,
        updatedAt: true
      }
    });
    // const users = await database.pool.query('SELECT * FROM users');
    // return users.rows;
  }

  async findUserById(id: string) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    // const users = this.users.map((user) => {
    //   const { password, ...userWithoutPassword } = user;
    //   return userWithoutPassword;
    // });
    // const user = users.find((user) => user.id === id);
    const user = await this.prisma.user.findFirst({
      where: { id }
    });

    if (user && UUIDRegEx.test(id)) {
      const {password, ...response} = user
      return response;
    } else if (!user && UUIDRegEx.test(id)) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async addUser(user: CreateUserDTO): Promise<Partial<User>> {
    const id = randomUUID();
    const version = 1;
    const createdAt: number = new Date().getMilliseconds();
    const updatedAt: number = new Date().getMilliseconds();
    const newUser = { id, ...user, version, createdAt, updatedAt };

    // this.users.push(newUser);
    const addedUser = await this.prisma.user.create({
      data: newUser
    })
    const { password, ...resNewUser } = addedUser;

    return resNewUser;
  }

  async updateUserPassword(id: string, updatedUserPassword: UpdatePasswordDto) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const users = await this.prisma.user.findMany();
    const user = users.find((user) => user.id === id);

    if (!UUIDRegEx.test(id)) {
      throw new HttpException(
        'Bad Request: Id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      !updatedUserPassword.oldPassword &&
      !updatedUserPassword.newPassword
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else if (updatedUserPassword.oldPassword !== user.password) {
      console.log(updatedUserPassword.newPassword);
      throw new HttpException('Old Password is wrong', HttpStatus.FORBIDDEN);
    } else {
      user.version = user.version + 1;
      user.password = updatedUserPassword.newPassword;
      user.updatedAt = new Date().getMilliseconds();
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user
      })

      const { password, ...updated} = updatedUser
      return updated;
    }
  }

  async deleteUser(id: string) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const removedUser = await this.prisma.user.findFirst({
      where: { id }
    })

    if (!UUIDRegEx.test(id)) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!removedUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      return this.prisma.user.delete({
        where: {id}
      })
    }
  }
}
