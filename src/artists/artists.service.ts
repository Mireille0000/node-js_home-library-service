import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from 'src/utils/interfaces';
import { CreateArtistDTO } from './dto/create-artist.dto';
import UpdateArtistDTO from './dto/update-artist.dto';
import { TemporaryDB } from 'src/database/temporary-db'; //
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ArtistsService {
  artists: Artist[] = [];

  constructor(private readonly prisma: PrismaService){}

  async findAllArtists() {
    return await this.prisma.artist.findMany();
  }

  async findArtistById(id: string) {
    // const artist = TemporaryDB.artists.find((artist) => artist.id === id);
    const artist = await this.prisma.artist.findFirst({
      where: { id }
    })
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!UUID.test(id)) {
      throw new HttpException('Bad Request: Invaid Id', HttpStatus.BAD_REQUEST);
    } else if (!artist) {
      throw new HttpException('Artist Not Found', HttpStatus.NOT_FOUND);
    } else {
      return artist;
    }
  }

  async createArtist(newArtist: CreateArtistDTO): Promise<Artist>{
    const id = randomUUID();
    const newArtistObj = { id, ...newArtist };
    const newArtistAdded = await this.prisma.artist.create({
      data: newArtistObj
    })
    TemporaryDB.artists.push(newArtistObj); // remove
    TemporaryDB.favorites.artists.push(newArtistObj); // remove
    return newArtistAdded;
  }

  async updateArtist(id: string, updatedArtistInfo: UpdateArtistDTO) {
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );
    // const artist = TemporaryDB.artists.find((artist) => artist.id === id);
    const artist = await this.prisma.artist.findFirst({
      where: { id }
    })

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!artist) {
      throw new HttpException('Artist Not Found', HttpStatus.NOT_FOUND);
    } else {
      const updatedArtist = { ...artist, ...updatedArtistInfo };
      await this.prisma.artist.update({
        where: {id},
        data: updatedArtist
      })
      TemporaryDB.artists = TemporaryDB.artists.map((artist) => {
        if (artist.id === id) {
          return updatedArtist;
        }
        return artist;
      }); // remove(done)
      return updatedArtist;
    }
  }

  async deleteArtist(id: string) {
    // const artistToRemove = TemporaryDB.artists.find(
    //   (artist) => artist.id === id,
    // );
    const artistToRemove = await this.prisma.artist.findFirst({
      where: {id}
    })
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!artistToRemove) {
      throw new HttpException('Artist Not Found', HttpStatus.NOT_FOUND);
    } else {
      TemporaryDB.artists = TemporaryDB.artists.filter(
        (artist) => artist.id !== id,
      ); // remove (done)
      TemporaryDB.tracks.filter((track) => {
        if (artistToRemove.id === track.artistId) {
          track.artistId = null;
        }
      }); // remove
      TemporaryDB.albums.filter((album) => {
        if (artistToRemove.id === album.artistId) {
          album.artistId = null;
        }
      }); // remove (done)

      if (TemporaryDB.favorites.artists.find((artist) => artist.id === id)) {
        TemporaryDB.favorites.artists = TemporaryDB.favorites.artists.filter(
          (artist) => artist.id !== id,
        );
      } // remove

      await this.prisma.album.updateMany({
        where: {
          artistId: id,
        },
        data: {
          artistId: null,
        }
      })

      await this.prisma.track.updateMany({
        where: {
          artistId: id,
        },
        data: {
          artistId: null,
        }
      })

      await this.prisma.artist.delete({
        where: { id }
      })
      return artistToRemove;
    }
  }
}
