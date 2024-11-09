import { Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { Artist } from 'src/utils/interfaces';
import { CreateArtistDTO } from './dto/create-artist.dto';
import UpdateArtistDTO from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService){}

    @Get()
    @Header("Content-Type", "application/json")
    findAllArtists(): Artist[] {
        return this.artistsService.findAllArtists();
    }

    @Get(":id")
    @Header("Content-Type", "application/json")
    findArtistById(@Param("id") id: string): Artist {
        return this.artistsService.findArtistById(id);
    }

    @Post()
    @Header("Content-Type", "application/json")
    @HttpCode(201)
    createArtist(@Body(ValidationPipe) newArtist: CreateArtistDTO) {
        return this.artistsService.createArtist(newArtist)
    }

    @Put(":id")
    updateArtist(@Param("id") id: string, @Body(ValidationPipe) updatedAtristInfo: UpdateArtistDTO) {
        return this.artistsService.updateArtist(id, updatedAtristInfo);
    }

    @Header("Content-Type", "application/json")
    @HttpCode(204)
    @Delete(":id")
    deleteArtist(@Param("id") id: string) {
        return this.artistsService.deleteArtist(id);
    }
}
