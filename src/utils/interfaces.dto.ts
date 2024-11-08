import { IsNotEmpty, IsString, isNotEmpty } from "class-validator";

export interface CreateUserDto {
    login: string;
    password: string;
  }

  export interface UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
  }

  export interface CreateTrackDto {
    name: string;
    duration: number;
  }