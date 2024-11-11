import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/utils/interfaces';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { randomUUID } from 'crypto';
import UpdateAlbumDTO from './dto/update-album.dto';
import { TemporaryDB } from 'src/database/temporary-db';
import { arch } from 'os';

@Injectable()
export class AlbumsService {
    albums: Album[] = []

    findAllAlbums() {
        return TemporaryDB.albums;
    }

    findAlbumById(id: string): Album {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const album = TemporaryDB.albums.find((album) => album.id === id);

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST);
        } else if (!album) {
            throw new HttpException("Album Not Found", HttpStatus.NOT_FOUND);
        } else {
            return album
        }
    }

    createAlbum(newAlbum: CreateAlbumDTO): Album {
        const id = randomUUID();
        let artistId: string | null;
        if(!newAlbum.artistId) {
            artistId = null
        } else {
            artistId = newAlbum.artistId;
        }
        const newAlbumObj = { id, ...newAlbum, artistId };
        // this.albums.push(newAlbumObj);
        TemporaryDB.albums.push(newAlbumObj)
        return newAlbumObj;
    }

    updateAlbum(id: string, updatedAlbum: UpdateAlbumDTO): Album {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const album = TemporaryDB.albums.find((album) => album.id === id);
        if (!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!album) {
            throw new HttpException("Album not Found", HttpStatus.NOT_FOUND)
        } else {
            const updatedAlbumObj = {...album, ...updatedAlbum}

            TemporaryDB.albums = TemporaryDB.albums.map((album) => {
                if (album.id === id) {
                    return updatedAlbumObj;
                }
                return album;
            })
            return updatedAlbumObj;
        }
    }

    deleteAlbum(id: string) {
        const albumToRemove = TemporaryDB.albums.find((album) => album.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!albumToRemove) {
            throw new HttpException("Album Not Found", HttpStatus.NOT_FOUND)
        } else {
            TemporaryDB.albums = TemporaryDB.albums.filter((album) => album.id !== id);
            TemporaryDB.tracks.filter((track) => {
                if (albumToRemove.id === track.albumId) {
                    track.albumId = null;
                }
            })
        }
    }
}
