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
import { ArtistsService } from './artists.service';
import { Artist } from 'src/utils/interfaces';
import { CreateArtistDTO } from './dto/create-artist.dto';
import UpdateArtistDTO from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAllArtists(): Promise<Artist[]> {
    return await this.artistsService.findAllArtists();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findArtistById(@Param('id') id: string): Promise<Artist> {
    return await this.artistsService.findArtistById(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async createArtist(@Body(ValidationPipe) newArtist: CreateArtistDTO) {
    return await this.artistsService.createArtist(newArtist);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedAtristInfo: UpdateArtistDTO,
  ) {
    return await this.artistsService.updateArtist(id, updatedAtristInfo);
  }

  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    return await this.artistsService.deleteArtist(id);
  }
}
