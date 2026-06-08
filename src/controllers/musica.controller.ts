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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MusicaService } from '../services/musica.service';
import {
  CreateMusicaDTO,
  UpdateMusicaDTO,
} from '../interfaces/musica.interface';
import { Musica } from '../entities/musica.entity';

@ApiTags('Músicas')
@Controller('musicas')
export class MusicaController {
  constructor(private readonly musicaService: MusicaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova música' })
  @ApiBody({
    type: CreateMusicaDTO,
    examples: {
      heyJude: {
        summary: 'Hey Jude — The Beatles',
        value: { titulo: 'Hey Jude', duracaoSegundos: 431, artistaId: 1 },
      },
      bohemianRhapsody: {
        summary: 'Bohemian Rhapsody — Queen',
        value: { titulo: 'Bohemian Rhapsody', duracaoSegundos: 354, artistaId: 2 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Música criada com sucesso.',
    schema: {
      example: { id: 1, titulo: 'Hey Jude', duracaoSegundos: 431, artistaId: 1 },
    },
  })
  @ApiResponse({ status: 400, description: 'Duração inválida (deve ser > 0) ou artistaId inexistente.' })
  async create(@Body() createDTO: CreateMusicaDTO): Promise<Musica> {
    return this.musicaService.create(createDTO);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar uma música por ID ou título (use apenas um dos dois)',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID da música',
    example: 1,
  })
  @ApiQuery({
    name: 'titulo',
    required: false,
    description: 'Título da música',
    example: 'Hey Jude',
  })
  @ApiResponse({
    status: 200,
    description: 'Música encontrada.',
    schema: {
      example: {
        id: 1,
        titulo: 'Hey Jude',
        duracaoSegundos: 431,
        artistaId: 1,
        artista: { id: 1, nome: 'The Beatles', nacionalidade: 'Britânica' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhum parâmetro fornecido ou ambos fornecidos (use id OU titulo).',
  })
  @ApiResponse({ status: 404, description: 'Música não encontrada.' })
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
  @ApiOperation({ summary: 'Atualizar dados de uma música pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da música', example: 1 })
  @ApiBody({
    type: UpdateMusicaDTO,
    examples: {
      updateTitulo: {
        summary: 'Atualizar apenas o título',
        value: { titulo: 'Hey Jude (Remaster)' },
      },
      updateDuracao: {
        summary: 'Atualizar apenas a duração',
        value: { duracaoSegundos: 440 },
      },
      updateArtista: {
        summary: 'Transferir música para outro artista',
        value: { artistaId: 3 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Música atualizada com sucesso.',
    schema: {
      example: { id: 1, titulo: 'Hey Jude (Remaster)', duracaoSegundos: 431, artistaId: 1 },
    },
  })
  @ApiResponse({ status: 404, description: 'Música não encontrada.' })
  @ApiResponse({ status: 400, description: 'Duração inválida (deve ser > 0).' })
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
  @ApiOperation({ summary: 'Remover uma música pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da música a ser removida', example: 1 })
  @ApiResponse({ status: 204, description: 'Música removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Música não encontrada.' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.musicaService.delete({
      id: Number(id),
    });
  }
}
