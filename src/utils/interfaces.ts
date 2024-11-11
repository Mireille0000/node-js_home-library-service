export interface User {
    id: string;
    login: string;
    password: string;
    version: number; 
    createdAt: number;
    updatedAt: number;
  }

  export interface Artist {
    id: string; // uuid v4
    name: string;
    grammy: boolean;
  }

  export interface Track {
    id: string; // uuid v4
    name: string;
    artistId: string | null; // refers to Artist
    albumId: string | null; // refers to Album
    duration: number; // integer number
  }

  export interface Album {
    id: string; // uuid v4
    name: string;
    year: number;
    artistId: string | null; // refers to Artist
  }

  export interface FavoritesResponse {
    artists: Artist[]; // favorite artists ids
    albums: Album[]; // favorite albums ids
    tracks: Track[]; // favorite tracks ids
  }

  export interface Favorites {
    artists: string[]; // favorite artists ids
    albums: string[]; // favorite albums ids
    tracks: string[]; // favorite tracks ids
  }