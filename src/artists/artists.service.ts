import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from 'src/utils/interfaces';
import { CreateArtistDTO } from './dto/create-artist.dto';
import UpdateArtistDTO from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
    artists: Artist[] = [];


    findAllArtists() {
        return this.artists;
    }

    findArtistById(id: string) {
        const artist = this.artists.find((artist) => artist.id === id);
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
        this.artists.push(newArtistObj);
        return newArtistObj;
    }

    updateArtist(id: string, updatedArtistInfo: UpdateArtistDTO) {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const artist = this.artists.find((artist) => artist.id === id);
        // should correctly update artist match

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST); 
        } else if (!artist) {
            throw new HttpException("Artist Not Found", HttpStatus.NOT_FOUND); 
        } else {
           this.artists = this.artists.map((artist) => {
             if (artist.id === id) {
                const updatedArtist = { ...artist, ...updatedArtistInfo };
                return updatedArtist;
             } 
             return artist
           })
           return artist;
        }
    }

    deleteArtist(id: string) {
        const artistToRemove = this.artists.find((artist) => artist.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        // should set album.artistId to null after deletion
        if (!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        }  else if (!artistToRemove) {
            throw new HttpException("Artist Not Found", HttpStatus.NOT_FOUND)
        } else {
            this.artists = this.artists.filter((artist) => artist.id !== id);
            return artistToRemove;
        }

    }
}
