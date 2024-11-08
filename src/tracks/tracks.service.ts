import { Body, Delete, Get, Header, HttpCode, HttpException, HttpStatus, Injectable, Param, Post, Put } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { Track } from 'src/utils/interfaces';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/interfaces.dto';

@Injectable()
export class TracksService {
    tracks: Track[] = [];

    @Get()
    findAllTracks() {
        return this.tracks;
    }

    @Get(':id')
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

        if (trackInfo.hasOwnProperty("name") && trackInfo.hasOwnProperty("duration")) {
            if(typeof trackInfo.duration === "number" && typeof trackInfo.name === "string") {
                this.tracks.push(newTrack);
                return newTrack;
            } else {
                throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
        }
    }

    @Put(":id")
    updateTrackInfo(@Param('id') id: string, @Body() updatedTrackInfo: Partial<UpdateTrackDto>) {
        // error codes 400, 404
        const track = this.tracks.find((track) => track.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if(!track) {
            throw new HttpException("Track Not Fount", HttpStatus.NOT_FOUND); // 404
        } else if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST); //400
        } else {
            if(updatedTrackInfo.name) {
                track.name = updatedTrackInfo.name;
            }
            if(updatedTrackInfo.duration) {
                track.duration = updatedTrackInfo.duration;
            }
            const updatedTrack =  {...track, ...updatedTrackInfo};
            return updatedTrack;
        }
    }

    @Delete(":id")
    deleteTrack(@Param("id") id: string) {
        const removedTrack  = this.tracks.find(((track) => track.id === id));
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST);   
        } else if (!removedTrack) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND);
        } else {
            this.tracks  = this.tracks.filter((track) => track.id !== id);
            return removedTrack;
        }
    }
}
