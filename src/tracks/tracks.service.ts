import { Body, Get, Header, HttpCode, HttpException, HttpStatus, Injectable, Param, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from 'src/utils/interfaces';
import { CreateTrackDto } from 'src/utils/interfaces.dto';

@Injectable()
export class TracksService {
    tracks: Track[] = [];

    @Get()
    @Header("Content-Type", "application/json")
    findAllTracks() {
        return this.tracks;
    }

    @Get(':id')
    @Header("Content-Type", "application/json")
    findTrackById(@Param('id') id: string) {
        const track =  this.tracks.find((track) => track.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if (!UUID.test(id)) {
            throw new HttpException('Track Id Not Valid', HttpStatus.BAD_REQUEST)
        } else if(!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND);
        } else {
            return track;
        }
    

    }

    @Post()
    addTrack(@Body() trackInfo: CreateTrackDto) {
        const id = randomUUID();
        const artistId = randomUUID();
        const albumId = randomUUID();
        const newTrack = {id, ...trackInfo, artistId, albumId};
        console.log(newTrack)
        if (trackInfo.hasOwnProperty("name") && trackInfo.hasOwnProperty("duration")) {
            this.tracks.push(newTrack);
            return newTrack;
        } else {
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
        }
        // this.tracks.push(newTrack);
        // return newTrack;
        // 400 error if fields are invalid'
    }
}
