import {
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findFavorites() {
    return this.favoritesService.findFavorites();
  }

  @Post('track/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async addTrackToFavs(@Param('id') id: string) {
    return await this.favoritesService.addTrackInFavs(id);
  }

  @Delete('track/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  deleteTrackFromFavs(@Param('id') id: string) {
    return this.favoritesService.deleteTrackFromFavs(id);
  }

  @Post('album/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async addAlbumToFavs(@Param('id') id: string) {
    return await this.favoritesService.addAlbumInFavs(id);
  }

  @Delete('album/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  deleteAlbumFromFavs(@Param('id') id: string) {
    return this.favoritesService.deleteAlbumFromFavs(id);
  }

  @Post('artist/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async addArtistToFavs(@Param('id') id: string) {
    return await this.favoritesService.addArtistInFavs(id);
  }

  @Delete('artist/:id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  deleteArtistFromFavs(@Param('id') id: string) {
    return this.favoritesService.deleteArtistFromFavs(id);
  }
}
