import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';

@Module({
  imports: [TracksModule, AlbumsModule, ArtistsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, TracksService, AlbumsService, ArtistsService]
})
export class FavoritesModule {}
