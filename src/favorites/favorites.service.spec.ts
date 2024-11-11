import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { TracksModule } from '../tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule],
      providers: [FavoritesService, TracksService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
