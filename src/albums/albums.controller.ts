import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from 'src/utils/interfaces';
import { CreateAlbumDTO } from './dto/create-album.dto';
import UpdateAlbumDTO from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAllAlbums() {
    return await this.albumService.findAllAlbums();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findAlbumById(@Param('id') id: string): Promise<Album> {
    return await this.albumService.findAlbumById(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async createAlbum(
    @Body(ValidationPipe) newAlbum: CreateAlbumDTO,
  ): Promise<Album> {
    return await this.albumService.createAlbum(newAlbum);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  async updateAlbum(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedAlbum: UpdateAlbumDTO,
  ) {
    return await this.albumService.updateAlbum(id, updatedAlbum);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    return await this.albumService.deleteAlbum(id);
  }
}
