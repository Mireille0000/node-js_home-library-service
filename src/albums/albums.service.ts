import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/utils/interfaces';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { randomUUID } from 'crypto';
import UpdateAlbumDTO from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
    albums: Album[] = []

    findAllAlbums() {
        return this.albums;
    }

    findAlbumById(id: string): Album {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const album = this.albums.find((album) => album.id === id);

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
        const artistId = null; // | string
        const newAlbumObj = { id, ...newAlbum, artistId };
        this.albums.push(newAlbumObj);
        return newAlbumObj;
    }

    updateAlbum(id: string, updatedAlbum: UpdateAlbumDTO): Album {
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
        const album = this.albums.find((album) => album.id === id);
        if (!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!album) {
            throw new HttpException("Album not Found", HttpStatus.NOT_FOUND)
        } else {
            const updatedAlbumObj = {...album, ...updatedAlbum}

            this.albums =  this.albums.map((album) => {
                if (album.id === id) {
                    return updatedAlbumObj;
                }
                return album;
            })
            return updatedAlbumObj;
        }
    }

    deleteAlbum(id: string) {
        const albumToRemove = this.albums.find((album) => album.id === id);
        const UUID = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);

        if(!UUID.test(id)) {
            throw new HttpException("Bad Request: Invalid Id", HttpStatus.BAD_REQUEST)
        } else if (!albumToRemove) {
            throw new HttpException("Album Not Found", HttpStatus.NOT_FOUND)
        } else {
            this.albums.filter((album) => album.id !== id);
            return albumToRemove;
        }


    }
}
