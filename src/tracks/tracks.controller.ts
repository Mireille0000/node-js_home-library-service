import { Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from 'src/utils/interfaces';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/interfaces.dto';

@Controller('track')
export class TracksController {
    // GET 
    // /track +
    // /track/:id (id: uuid) +
    // POST
    // /track +
    // error handling +
    //  PUT
    // /track/:id (id: uuid)
    // error handling
    // DELETE
    // /track/:id
    constructor(private readonly trackService: TracksService) {

    }

    @Get()
    @Header("Content-Type", "application/json")
    findAllTracks() {
        return this.trackService.findAllTracks();
    }

    @Get(':id')
    @Header("Content-Type", "application/json")
    findTrackById(@Param('id') id: string) {
        return this.trackService.findTrackById(id);
    }

    @Post()
    @Header("Content-Type", "application/json")
    @HttpCode(201)
    addTrack(@Body() newUser: CreateTrackDto) {
        return this.trackService.addTrack(newUser)
    }

    @Put(':id')
    @Header("Content-Type", "application/json")
    updateTrackInfo(@Param('id') id: string, @Body() updatedTrackInfo: UpdateTrackDto) {
        return this.trackService.updateTrackInfo(id, updatedTrackInfo);
        
    }

    @Delete(":id")
    @Header("Content-Type", "application/json")
    @HttpCode(204)
    deleteTrack(@Param("id") id: string) {
        return this.trackService.deleteTrack(id);
    }

}
