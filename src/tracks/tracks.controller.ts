import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { UpdateTrackDto } from 'src/utils/interfaces.dto';
import { CreateTrackDTO } from './dto/create-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAllTracks() {
    return this.trackService.findAllTracks();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findTrackById(@Param('id') id: string) {
    return this.trackService.findTrackById(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  addTrack(@Body(ValidationPipe) newUser: CreateTrackDTO) {
    return this.trackService.addTrack(newUser);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  updateTrackInfo(
    @Param('id') id: string,
    @Body() updatedTrackInfo: UpdateTrackDto,
  ) {
    return this.trackService.updateTrackInfo(id, updatedTrackInfo);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  deleteTrack(@Param('id') id: string) {
    return this.trackService.deleteTrack(id);
  }
}
