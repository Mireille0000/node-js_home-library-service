import { Injectable } from '@nestjs/common';
import { Favorites } from 'src/utils/interfaces';

@Injectable()
export class FavoritesService {
    favorites: Favorites = {
        artists: [],
        albums: [],
        tracks: []
    };

    findFavorites() {
        return this.favorites;
    }
}
