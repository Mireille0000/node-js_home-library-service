import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/utils/interfaces';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { randomUUID } from 'crypto';
import UpdateAlbumDTO from './dto/update-album.dto';
import { TemporaryDB } from 'src/database/temporary-db';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AlbumsService {
  albums: Album[] = [];
  constructor(private readonly prisma: PrismaService) {}

  async findAllAlbums() {
    return await this.prisma.album.findMany();
  }

  async findAlbumById(id: string): Promise<Album> {
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
      return album;
    }
  }

  async createAlbum(newAlbum: CreateAlbumDTO): Promise<Album> {
    const id = randomUUID();
    let artistId: string | null;
    if (!newAlbum.artistId) {
      artistId = null;
    } else {
      artistId = newAlbum.artistId;
    }
    const newAlbumObj = { id, ...newAlbum, artistId };
    const newAlbumAdded = await this.prisma.album.create({
      data: newAlbumObj,
    });
    return newAlbumAdded;
  }

  async updateAlbum(id: string, updatedAlbum: UpdateAlbumDTO): Promise<Album> {
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
      throw new HttpException('Album not Found', HttpStatus.NOT_FOUND);
    } else {
      const updatedAlbumObj = { ...album, ...updatedAlbum };
      await this.prisma.album.update({
        where: { id },
        data: updatedAlbumObj,
      });
      return updatedAlbumObj;
    }
  }

  async deleteAlbum(id: string) {
    const albumToRemove = await this.prisma.album.findFirst({
      where: { id },
    });

    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!UUID.test(id)) {
      throw new HttpException(
        'Bad Request: Invalid Id',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!albumToRemove) {
      throw new HttpException('Album Not Found', HttpStatus.NOT_FOUND);
    } else {
      await this.prisma.track.updateMany({
        where: {
          albumId: id,
        },
        data: {
          albumId: null,
        },
      });

      const albumId = id;

      await this.prisma.favoriteAlbums.deleteMany({
        where: {
          albumId,
        },
      });

      await this.prisma.album.delete({
        where: { id: albumId },
      });
    }
  }
}
