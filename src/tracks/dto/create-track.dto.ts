import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  artistId: string | null;
  albumId: string | null;
}
