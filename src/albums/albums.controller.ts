import { Body, Controller, Get, Header, HttpCode, Param, Post, ValidationPipe } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from 'src/utils/interfaces';
import { CreateAlbumDTO } from './dto/create-album.dto';

@Controller('album')
export class AlbumsController {
    constructor(private readonly albumService: AlbumsService){}

    @Get()
    @Header("Content-Type", "application/json")
    findAllAlbums() {
        return this.albumService.findAllAlbums();
    }

    @Get(":id")
    @Header("Content-Type", "application/json")
    findAlbumById(@Param("id") id: string): Album {
        return this.albumService.findAlbumById(id);
    }

    @Post()
    @Header("Content-Type", "application/json")
    @HttpCode(201)
    createAlbum(@Body(ValidationPipe) newAlbum: CreateAlbumDTO): Album {
        return this.albumService.createAlbum(newAlbum);
    }
}
