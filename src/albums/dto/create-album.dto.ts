import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAlbumDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;
}