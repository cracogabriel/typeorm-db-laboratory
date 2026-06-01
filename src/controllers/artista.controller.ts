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
import { ArtistaService } from '../services/artista.service';
import {
  CreateArtistaDTO,
  UpdateArtistaDTO,
} from '../interfaces/artista.interface';
import { Artista } from '../entities/artista.entity';

@Controller('artistas')
export class ArtistaController {
  constructor(private readonly artistaService: ArtistaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDTO: CreateArtistaDTO): Promise<Artista> {
    return this.artistaService.create(createDTO);
  }

  @Get()
  async retrieve(
    @Query('id') id?: string,
    @Query('nome') nome?: string,
  ): Promise<Artista> {
    return this.artistaService.retrieve({
      ...(id && { id: Number(id) }),
      ...(nome && { nome }),
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDTO: Omit<UpdateArtistaDTO, 'id'>,
  ): Promise<Artista> {
    return this.artistaService.update({
      ...updateDTO,
      id: Number(id),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.artistaService.delete({
      id: Number(id),
    });
  }
}
