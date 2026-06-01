import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MusicaService } from '../services/musica.service';
import {
  CreateMusicaDTO,
  UpdateMusicaDTO,
} from '../interfaces/musica.interface';
import { Musica } from '../entities/musica.entity';

@Controller('musicas')
export class MusicaController {
  constructor(private readonly musicaService: MusicaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDTO: CreateMusicaDTO): Promise<Musica> {
    return this.musicaService.create(createDTO);
  }

  @Get()
  async retrieve(
    @Query('id') id?: string,
    @Query('titulo') titulo?: string,
  ): Promise<Musica> {
    return this.musicaService.retrieve({
      ...(id && { id: Number(id) }),
      ...(titulo && { titulo }),
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDTO: Omit<UpdateMusicaDTO, 'id'>,
  ): Promise<Musica> {
    return this.musicaService.update({
      ...updateDTO,
      id: Number(id),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.musicaService.delete({
      id: Number(id),
    });
  }
}
