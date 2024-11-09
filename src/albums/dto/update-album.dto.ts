import { CreateAlbumDTO } from "./create-album.dto";
import { PartialType } from "@nestjs/mapped-types";

export default class UpdateAlbumDTO extends PartialType(CreateAlbumDTO){}