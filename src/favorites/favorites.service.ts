import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Favorites, FavoritesResponse } from 'src/utils/interfaces';
import { TracksService } from 'src/tracks/tracks.service';
import { ModuleRef } from '@nestjs/core';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TemporaryDB } from 'src/database/temporary-db';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoritesService {
  favorites: FavoritesResponse;
  favoritesReq: Favorites;

  tracksService: TracksService;
  albumsService: AlbumsService;
  artistsService: ArtistsService;

  constructor(private readonly prisma: PrismaService, private readonly moduleRef: ModuleRef) {
    this.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };

    this.favoritesReq = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  findFavorites() {
    // return this.favorites;
    return TemporaryDB.favorites;
  }

  findFavsIds() {
    return this.favoritesReq;
  }

  addTrackInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    this.tracksService = this.moduleRef.get(TracksService);
    const tracks = this.tracksService.findAllTracks();
    const track = tracks.find((track) => track.id === id);
    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!track) {
      throw new HttpException(
        'Track Not Found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      this.favorites.tracks.push(track);
      this.favoritesReq.tracks.push(track.id); //
      TemporaryDB.favorites.tracks.push(track);
      return track;
    }
  }

  deleteTrackFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const track = this.favorites.tracks.find((track) => track.id === id);

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!track) {
      throw new HttpException('Track Not Found', HttpStatus.NOT_FOUND);
    } else {
      this.favorites.tracks = this.favorites.tracks.filter(
        (track) => track.id !== id,
      );
      this.favoritesReq.tracks = this.favoritesReq.tracks.filter(
        (reqId) => reqId !== id,
      ); //
      if (TemporaryDB.tracks.find((track) => track.id === id)) {
        TemporaryDB.favorites.tracks = TemporaryDB.favorites.tracks.filter(
          (track) => track.id !== id,
        );
      }
      // TemporaryDB.favorites.tracks = TemporaryDB.favorites.tracks.filter((track) => track.id !== id)
    }
  }

  addAlbumInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    this.albumsService = this.moduleRef.get(AlbumsService);
    const albums = this.albumsService.findAllAlbums();
    const album = albums.find((album) => album.id === id);
    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!album) {
      throw new HttpException(
        'Album Not Found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      this.favorites.albums.push(album);
      this.favoritesReq.albums.push(album.id); //
      TemporaryDB.favorites.albums.push(album);
      return album;
    }
  }

  deleteAlbumFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const album = this.favorites.albums.find((album) => album.id === id);

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!album) {
      throw new HttpException('Album Not Found', HttpStatus.NOT_FOUND);
    } else {
      this.favorites.albums = this.favorites.albums.filter(
        (album) => album.id !== id,
      );
      this.favoritesReq.albums = this.favoritesReq.albums.filter(
        (reqId) => reqId !== id,
      );
      if (this.favorites.tracks.length > 0) {
        this.favorites.tracks.filter((track) => {
          if (album.id === track.albumId) {
            track.albumId = null;
          }
        });
      }

      if (TemporaryDB.favorites.albums.find((album) => album.id === id)) {
        TemporaryDB.favorites.albums = TemporaryDB.favorites.albums.filter(
          (album) => album.id !== id,
        );
      }
    }
  }

  async addArtistInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    this.artistsService = this.moduleRef.get(ArtistsService);
    const artists = this.artistsService.findAllArtists();
    // const artist = artists.find((artist) => artist.id === id);
    const artist = await this.prisma.artist.findFirst({
      where: {id}
    });
    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!artist) {
      throw new HttpException(
        'Album Not Found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      this.favorites.artists.push(artist);
      this.favoritesReq.artists.push(artist.id); //
      return artist;
    }
  }

  deleteArtistFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const artist = this.favorites.artists.find((artist) => artist.id === id);

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!artist) {
      throw new HttpException('Artist Not Found', HttpStatus.NOT_FOUND);
    } else {
      this.favorites.artists = this.favorites.artists.filter(
        (artist) => artist.id !== id,
      );
      console.log(this.favorites.tracks[0]);
      this.favoritesReq.artists = this.favoritesReq.artists.filter(
        (reqId) => reqId !== id,
      );
      if (this.favorites.tracks.length > 0) {
        this.favorites.tracks.filter((track) => {
          if (artist && artist.id === track.artistId) {
            track.artistId = null;
          }
        });
      }

      if (this.favorites.tracks.length > 0) {
        this.favorites.albums.filter((album) => {
          if (artist && artist.id === album.artistId) {
            album.artistId = null;
          }
        });
      }

      if (TemporaryDB.favorites.artists.find((artist) => artist.id === id)) {
        TemporaryDB.favorites.artists = TemporaryDB.favorites.artists.filter(
          (artist) => artist.id !== id,
        );
      }
    }
  }
}
