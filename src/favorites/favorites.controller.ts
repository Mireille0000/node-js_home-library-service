import { Controller, Delete, Get, Header, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService){}

    @Get()
    @Header("Content-Type", "application/json")
    findFavorites() {
        return this.favoritesService.findFavorites()
    }

    @Post("track/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(201) 
    addTrackToFavs(@Param("id") id: string) {
        return this.favoritesService.addTrackInFavs(id);
    }

    @Delete("track/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteTrackFromFavs(id: string) {
        // status codes: 204, 400, 404
        return console.log("delete track from favs")
    }

    @Post("album/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(201) 
    addAlbumToFavs(@Param("id") id: string) {
        // status codes: 201, 400, 422
        return this.favoritesService.addAlbumInFavs(id);
    }

    @Delete("album/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteAlbumFromFavs(id: string) {
        // status codes: 204, 400, 404
        return console.log("delete album from favs")
    }

    @Post("artist/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(201) 
    addArtistToFavs(@Param("id") id: string) {
        // status codes: 201, 400, 422
        return this.favoritesService.addArtistInFavs(id);
    }

    @Delete("/artist/:id")
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteArtistFromFavs(id: string) {
        // status codes: 204, 400, 404
        return console.log("delete artist from favs")
    }

}
