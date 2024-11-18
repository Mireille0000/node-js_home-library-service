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
  async findAllTracks() {
    return await this.trackService.findAllTracks();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findTrackById(@Param('id') id: string) {
    return await this.trackService.findTrackById(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @HttpCode(201)
  async addTrack(@Body(ValidationPipe) newUser: CreateTrackDTO) {
    return await this.trackService.addTrack(newUser);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  async updateTrackInfo(
    @Param('id') id: string,
    @Body() updatedTrackInfo: UpdateTrackDto,
  ) {
    return await this.trackService.updateTrackInfo(id, updatedTrackInfo);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  @HttpCode(204)
  async deleteTrack(@Param('id') id: string) {
    return await this.trackService.deleteTrack(id);
  }
}
