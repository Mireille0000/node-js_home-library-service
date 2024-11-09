import { IsBoolean, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateArtistDTO } from "./create-artist.dto";

export default class UpdateArtistDTO extends PartialType(CreateArtistDTO){}