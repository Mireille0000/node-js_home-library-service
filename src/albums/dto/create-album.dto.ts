import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlbumDTO {
  artistId: string | null;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
