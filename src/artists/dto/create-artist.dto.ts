import { isUUID } from "class-validator";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    grammy: boolean;
}