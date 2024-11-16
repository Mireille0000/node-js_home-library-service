import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from 'src/utils/interfaces';
import { CreateUserDto } from 'src/utils/interfaces.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import * as database from '../database/db';

@Injectable()
export class UsersService {
  users: Array<User> = [];

  async findAll() {
    const users = await database.pool.query('SELECT * FROM users');
    return users.rows;
    // const users = this.users.map((user) => {
    //   const { password, ...userWithoutPassward } = user;
    //   return userWithoutPassward;
    // });
    // return users;
  }

  findUserById(id: string) {
    // CREATE
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const users = this.users.map((user) => {
      const { password, ...userWithoutPassward } = user;
      return userWithoutPassward;
    });
    const user = users.find((user) => user.id === id);
    if (user && UUIDRegEx.test(id)) {
      return user;
    } else if (!user && UUIDRegEx.test(id)) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  addUser(user: CreateUserDto) {
    const id = randomUUID();
    const version = 1;
    const createdAt: number = new Date().getMilliseconds();
    const updatedAt: number = new Date().getMilliseconds();
    const newUser = { id, ...user, version, createdAt, updatedAt };

    if (!user.login || !user.password) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    } else {
      this.users.push(newUser); //query ADD INTO
    }
    const { password, ...resNewUser } = newUser;

    return resNewUser;
  }

  updateUserPassword(id: string, updatedUserPassword: UpdatePasswordDto) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const user = this.users.find((user) => user.id === id);

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
      const { password, ...updatedUser } = user;
      return updatedUser;
    }
  }

  deleteUser(id: string) {
    const UUIDRegEx = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const removedUser = this.users.find((user) => user.id === id);
    if (!UUIDRegEx.test(id)) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!removedUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      this.users = this.users.filter((user) => user.id !== id);
    }
  }
}
