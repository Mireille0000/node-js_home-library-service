import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Favorites } from 'src/utils/interfaces';
import { TracksService } from 'src/tracks/tracks.service';
import { ModuleRef } from '@nestjs/core';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TemporaryDB } from 'src/database/temporary-db';

@Injectable()
export class FavoritesService{
    favorites: Favorites = {
        artists: [],
        albums: [],
        tracks: []
    };

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
        this.favorites = {
            artists: artists,
            albums: albums,
            tracks: tracks
        } // change!
        
        return this.favorites;
    }

    addTrackInFavs(id: string) {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        this.tracksService = this.moduleRef.get(TracksService);
        const tracks = this.tracksService.findAllTracks();
        const track = tracks.find((track) => track.id === id);
        if(!UUID.test(id)) { 
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!track) {
            throw new HttpException("Track Not Found", HttpStatus.UNPROCESSABLE_ENTITY)
        } else {
            this.favorites.tracks.push(track);
            return track;
        }
    }

    deleteTrackFromFavs(id: string) {
        
    }

    addAlbumInFavs(id: string) {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        this.albumsService = this.moduleRef.get(AlbumsService);
        const albums = this.albumsService.findAllAlbums();
        const album = albums.find((album) => album.id === id);
        if(!UUID.test(id)) { 
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!album) {
            throw new HttpException("Album Not Found", HttpStatus.UNPROCESSABLE_ENTITY)
        } else {
            this.favorites.albums.push(album);
            return album;
        }
    }

    deleteAlbumFromFavs(id: string) {
        
    }

    addArtistInFavs(id: string) {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        this.artistsService = this.moduleRef.get(ArtistsService);
        const artists = this.artistsService.findAllArtists();
        const artist = artists.find((artist) => artist.id === id);
        if(!UUID.test(id)) { 
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!artist) {
            throw new HttpException("Album Not Found", HttpStatus.UNPROCESSABLE_ENTITY)
        } else {
            this.favorites.artists.push(artist);
            return artist;
        }
    }

    deleteArtistFromFavs(id: string) {
        
    }
}
