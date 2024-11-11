import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from 'src/utils/interfaces';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/interfaces.dto';
import { TemporaryDB } from 'src/database/temporary-db';
import { CreateTrackDTO } from './dto/create-track.dto';

@Injectable()
export class TracksService {
    tracks: Track[];

    constructor() {
        this.tracks = []
    }

    findAllTracks() {
        console.log(this.tracks);
        return TemporaryDB.tracks;
    }

    findTrackById( id: string) {
        const track =  TemporaryDB.tracks.find((track) => track.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if (!UUID.test(id)) {
            throw new HttpException('Track Id Not Valid', HttpStatus.BAD_REQUEST)
        } else if(!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND);
        } else {
            return track;
        }
    

    }

    addTrack(trackInfo: CreateTrackDTO) {
        const id = randomUUID();
        let artistId: string | null;
        let albumId: (string | null);
        if(!trackInfo.artistId) {
            artistId = null;
        } else {
            artistId = trackInfo.artistId;
        }

        if(!trackInfo.albumId) {
            albumId = null;
        } else {
            albumId = trackInfo.albumId;
        }
        const newTrack = {id, ...trackInfo, artistId, albumId};
        TemporaryDB.tracks.push(newTrack);
        return newTrack;
    }

    updateTrackInfo(id: string, updatedTrackInfo: Partial<UpdateTrackDto>) {
        const track = TemporaryDB.tracks.find((track) => track.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST); //400
        } else if (!updatedTrackInfo.name || !updatedTrackInfo.duration) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        } else if(!track) {
            throw new HttpException("Track Not Fount", HttpStatus.NOT_FOUND); // 404
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

    deleteTrack( id: string) {
        const removedTrack  = TemporaryDB.tracks.find(((track) => track.id === id));
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST);   
        } else if (!removedTrack) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND);
        } else {
            TemporaryDB.tracks = TemporaryDB.tracks.filter((track) => track.id !== id);
            // return removedTrack;
        }
    }
}
