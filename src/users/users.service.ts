import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'src/utils/interfaces';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'nestjs-prisma';
// import * as database from '../database/db';
import { CreateUserDTO } from './dto/create-user.dto';
import { encodePassword } from 'src/auth/utils/bcrypt';
import * as bcrypt from 'bcrypt'

import { User as PrismaUser } from '@prisma/client'; //

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  users: Array<User> = [];

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        password: false,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // const users = await database.pool.query('SELECT * FROM users');
    // return users.rows;
  }

  async findUserById(id: string) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (user && UUIDRegEx.test(id)) {
      const { password, ...response } = user;
      return response;
    } else if (!user && UUIDRegEx.test(id)) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: {login}
    });
    return user;
  }

  async addUser(user: PrismaUser): Promise<Partial<User>>{
    if(!user.login || !user.password) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    const id = randomUUID();
    const version = 1;
    const createdAt = new Date();
    const updatedAt = new Date();
    const login = user.login;
    const userPassword = encodePassword(user?.password);

    const newUser = { 
      id, 
      login, 
      password: userPassword, 
      version, 
      createdAt, 
      updatedAt };

    const addedUser = await this.prisma.user.create({
      data: newUser,
    });
    const { password, ...userWthoutPassword } = addedUser;
    const response = {
      ...userWthoutPassword,
      createdAt: userWthoutPassword.createdAt.getTime(),
      updatedAt: userWthoutPassword.updatedAt.getTime()
    }

    return response;
  }

  async updateUserPassword(
    id: string,
    updatedUserPassword: UpdatePasswordDto,
  ) {

    const UUIDRegEx = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    if (!UUIDRegEx.test(id)) {
      throw new HttpException('Bad Request: Id is invalid', HttpStatus.BAD_REQUEST);
    }
  
    if (!updatedUserPassword.oldPassword || !updatedUserPassword.newPassword) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
  
    const isOldPasswordCorrect = bcrypt.compareSync(updatedUserPassword.oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      throw new HttpException('Old Password is wrong', HttpStatus.FORBIDDEN);
    }
  
    const encodedNewPassword = encodePassword(updatedUserPassword.newPassword);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: encodedNewPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
  
    const { password, ...updated } = updatedUser; 
    const response = {...updated, createdAt: updatedUser.createdAt.getTime(), updatedAt: updatedUser.updatedAt.getTime()}
    return response;
  }
  

  async deleteUser(id: string) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const removedUser = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!UUIDRegEx.test(id)) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!removedUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      return this.prisma.user.delete({
        where: { id },
      });
    }
  }
}
