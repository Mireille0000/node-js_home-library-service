import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from 'src/utils/interfaces';
import { CreateArtistDTO } from './dto/create-artist.dto';
import UpdateArtistDTO from './dto/update-artist.dto';
import { TemporaryDB } from 'src/database/temporary-db';

@Injectable()
export class ArtistsService {
    artists: Artist[] = [];


    findAllArtists() {
        return TemporaryDB.artists;
    }

    findArtistById(id: string) {
        const artist = TemporaryDB.artists.find((artist) => artist.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invaid Id", HttpStatus.BAD_REQUEST)
        } else if(!artist) {
            throw new HttpException("Artist Not Found", HttpStatus.NOT_FOUND)
        } else {
            return artist;
        }
    }

    createArtist(newArtist: CreateArtistDTO): Artist {
        const id = randomUUID();
        const newArtistObj = {id, ...newArtist};
        TemporaryDB.artists.push(newArtistObj);
        // this.artists.push(newArtistObj);
        return newArtistObj;
    }

    updateArtist(id: string, updatedArtistInfo: UpdateArtistDTO) {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const artist = TemporaryDB.artists.find((artist) => artist.id === id);
        // should correctly update artist match

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST); 
        } else if (!artist) {
            throw new HttpException("Artist Not Found", HttpStatus.NOT_FOUND); 
        } else {
        const updatedArtist = {...artist, ...updatedArtistInfo };
        TemporaryDB.artists = TemporaryDB.artists.map((artist) => {
            if (artist.id === id) {
               return updatedArtist;
            } 
            return artist
          })
           return updatedArtist;
        }
    }

    deleteArtist(id: string) {
        const artistToRemove = TemporaryDB.artists.find((artist) => artist.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        // should set album.artistId to null after deletion
        if (!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        }  else if (!artistToRemove) {
            throw new HttpException("Artist Not Found", HttpStatus.NOT_FOUND)
        } else {
            TemporaryDB.artists = TemporaryDB.artists.filter((artist) => artist.id !== id);
            TemporaryDB.tracks.filter((track) => {
                if (artistToRemove.id === track.artistId) {
                    track.artistId = null;
                }
            })
            TemporaryDB.albums.filter((album) => {
                if (artistToRemove.id === album.artistId) {
                    album.artistId = null;
                }
            })
            return artistToRemove;
        }

    }
}
