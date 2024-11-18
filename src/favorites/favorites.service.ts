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

  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleRef: ModuleRef,
  ) {
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

  async findFavorites() {
    const artists = await this.prisma.favoriteArtists.findMany({
      include: {
        artist: true,
      },
    });
    const albums = await this.prisma.favoriteAlbums.findMany({
      include: {
        album: true,
      },
    });
    const tracks = await this.prisma.favoriteTracks.findMany({
      include: {
        track: true,
      },
    });

    const favorites = {
      artists: artists.map((fav) => fav.artist),
      albums: albums.map((fav) => fav.album),
      tracks: tracks.map((fav) => fav.track),
    };
    return favorites;
  }

  async addTrackInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const track = await this.prisma.track.findFirst({
      where: { id },
    });
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
      const trackId = id;
      await this.prisma.favoriteTracks.create({
        data: {
          trackId,
        },
      });
      // this.favorites.tracks.push(track); // remove
      // this.favoritesReq.tracks.push(track.id); //
      // TemporaryDB.favorites.tracks.push(track); // remove
      return track;
    }
  }

  async deleteTrackFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const track = this.prisma.track.findFirst({
      where: { id },
    });

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!track) {
      throw new HttpException('Track Not Found', HttpStatus.NOT_FOUND);
    } else {
      const trackId = id;

      await this.prisma.favoriteTracks.deleteMany({
        where: {
          trackId,
        },
      });
    }
  }

  async addAlbumInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const album = await this.prisma.album.findFirst({
      where: { id },
    });
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
      const albumId = id;
      await this.prisma.favoriteAlbums.create({
        data: {
          albumId,
        },
      });
      return album;
    }
  }

  async deleteAlbumFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const album = await this.prisma.album.findFirst({
      where: { id },
    });

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!album) {
      throw new HttpException('Album Not Found', HttpStatus.NOT_FOUND);
    } else {
      const albumId = id;
      await this.prisma.favoriteAlbums.deleteMany({
        where: {
          albumId,
        },
      });
    }
  }

  async addArtistInFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const artist = await this.prisma.artist.findFirst({
      where: { id },
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
      const artistId = id;
      await this.prisma.favoriteArtists.create({
        data: {
          artistId,
        },
      });
      return artist;
    }
  }

  async deleteArtistFromFavs(id: string) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    const artist = await this.prisma.artist.findFirst({
      where: { id },
    });

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!artist) {
      throw new HttpException('Artist Not Found', HttpStatus.NOT_FOUND);
    } else {
      const artistId = id;
      await this.prisma.favoriteArtists.deleteMany({
        where: {
          artistId,
        },
      });
    }
  }
}
