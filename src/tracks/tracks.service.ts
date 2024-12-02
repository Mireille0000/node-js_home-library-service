import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from 'src/utils/interfaces';
import { UpdateTrackDto } from 'src/utils/interfaces.dto';
// import { TemporaryDB } from 'src/database/temporary-db';
import { CreateTrackDTO } from './dto/create-track.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TracksService {
  tracks: Track[];

  constructor(private readonly prisma: PrismaService) {
    this.tracks = [];
  }

  async findAllTracks() {
    return await this.prisma.track.findMany();
  }

  async findTrackById(id: string) {
    const track = await this.prisma.track.findFirst({
      where: { id },
    });
    const UUID = new RegExp(
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    );

    if (!UUID.test(id)) {
      throw new HttpException('Track Id Not Valid', HttpStatus.BAD_REQUEST);
    } else if (!track) {
      throw new HttpException('Track Not Found', HttpStatus.NOT_FOUND);
    } else {
      return track;
    }
  }

  async addTrack(trackInfo: CreateTrackDTO) {
    const id = randomUUID();
    let artistId: string | null;
    let albumId: string | null;
    if (!trackInfo.artistId) {
      artistId = null;
    } else {
      artistId = trackInfo.artistId;
    }

    if (!trackInfo.albumId) {
      albumId = null;
    } else {
      albumId = trackInfo.albumId;
    }
    const newTrack = { id, ...trackInfo, artistId, albumId };
    const newTrackAdded = await this.prisma.track.create({
      data: newTrack,
    });
    return newTrackAdded;
  }

  async updateTrackInfo(id: string, updatedTrackInfo: Partial<UpdateTrackDto>) {
    const track = await this.prisma.track.findFirst({
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
    } else if (!updatedTrackInfo.name || !updatedTrackInfo.duration) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!track) {
      throw new HttpException('Track Not Fount', HttpStatus.NOT_FOUND); // 404
    } else {
      if (updatedTrackInfo.name) {
        track.name = updatedTrackInfo.name;
      }
      if (updatedTrackInfo.duration) {
        track.duration = updatedTrackInfo.duration;
      }
      const updatedTrack = { ...track, ...updatedTrackInfo };
      await this.prisma.track.update({
        where: { id },
        data: updatedTrack,
      });
      return updatedTrack;
    }
  }

  async deleteTrack(id: string) {
    const removedTrack = await this.prisma.track.findFirst({
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
    } else if (!removedTrack) {
      throw new HttpException('Track Not Found', HttpStatus.NOT_FOUND);
    } else {
      const trackId = id;
      await this.prisma.favoriteTracks.deleteMany({
        where: {
          trackId,
        },
      });
      await this.prisma.track.delete({
        where: { id: trackId },
      });
    }
  }
}
