import { Injectable } from '@nestjs/common';
import { Favorites } from 'src/utils/interfaces';
import { TracksService } from 'src/tracks/tracks.service';
import { ModuleRef } from '@nestjs/core';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TemporaryDB } from 'src/database/temporary-db';

@Injectable()
export class FavoritesService{
    favorites: Favorites;

    tracksService: TracksService;
    albumsService: AlbumsService;
    artistsService: ArtistsService;

    constructor(private readonly moduleRef: ModuleRef){}

    findFavorites() {   
        this.tracksService = this.moduleRef.get(TracksService);
        this.albumsService = this.moduleRef.get(AlbumsService);
        this.artistsService =  this.moduleRef.get(ArtistsService);
        const tracks = this.tracksService.findAllTracks();
        const albums = this.albumsService.findAllAlbums();
        const artists = this.artistsService.findAllArtists();
        console.log(artists);
        this.favorites = {
            artists: artists,
            albums: albums,
            tracks: tracks
        }
        
        return this.favorites;
    }
}
