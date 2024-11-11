import { Album, Artist, Favorites, Track, User } from "src/utils/interfaces";

interface HomeLibData {
    users: User[];
    artists: Artist[];
    albums: Album[];
    tracks: Track[]
}

export const TemporaryDB: HomeLibData = {
    users: [],
    artists: [],
    albums: [],
    tracks: []
}