import {
  Album,
  Artist,
  FavoritesResponse,
  Track,
  User,
} from 'src/utils/interfaces';

interface HomeLibData {
  users: User[]; //
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: FavoritesResponse;
}

export const TemporaryDB: HomeLibData = {
  users: [], //
  artists: [],
  albums: [],
  tracks: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
