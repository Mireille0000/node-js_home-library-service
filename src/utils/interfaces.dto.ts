export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
} //

export interface CreateTrackDto {
  name: string;
  duration: number;
}

export type UpdateTrackDto = CreateTrackDto;
