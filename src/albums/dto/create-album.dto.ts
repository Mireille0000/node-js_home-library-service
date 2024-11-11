import { IsUUID } from "class-validator";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAlbumDTO {
    // @IsUUID()
    artistId: string | null;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;
}