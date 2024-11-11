import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateTrackDTO {
    // artistId: string | null;
    // albumId: string | null;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    artistId: string | null;
    albumId: string | null;
}