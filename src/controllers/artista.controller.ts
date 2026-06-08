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
import { ArtistaService } from '../services/artista.service';
import {
  CreateArtistaDTO,
  UpdateArtistaDTO,
} from '../interfaces/artista.interface';
import { Artista } from '../entities/artista.entity';

@ApiTags('Artistas')
@Controller('artistas')
export class ArtistaController {
  constructor(private readonly artistaService: ArtistaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo artista' })
  @ApiBody({
    type: CreateArtistaDTO,
    examples: {
      beatles: {
        summary: 'The Beatles',
        value: { nome: 'The Beatles', nacionalidade: 'Britânica' },
      },
      madonna: {
        summary: 'Madonna',
        value: { nome: 'Madonna', nacionalidade: 'Americana' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Artista criado com sucesso.',
    schema: {
      example: { id: 1, nome: 'The Beatles', nacionalidade: 'Britânica' },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createDTO: CreateArtistaDTO): Promise<Artista> {
    return this.artistaService.create(createDTO);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar um artista por ID ou nome (use apenas um dos dois)',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID do artista',
    example: 1,
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    description: 'Nome do artista',
    example: 'The Beatles',
  })
  @ApiResponse({
    status: 200,
    description: 'Artista encontrado.',
    schema: {
      example: { id: 1, nome: 'The Beatles', nacionalidade: 'Britânica' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhum parâmetro fornecido ou ambos fornecidos (use id OU nome).',
  })
  @ApiResponse({ status: 404, description: 'Artista não encontrado.' })
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
  @ApiOperation({ summary: 'Atualizar dados de um artista pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do artista', example: 1 })
  @ApiBody({
    type: UpdateArtistaDTO,
    examples: {
      updateNome: {
        summary: 'Atualizar apenas o nome',
        value: { nome: 'The Beatles (Remaster)' },
      },
      updateNacionalidade: {
        summary: 'Atualizar apenas a nacionalidade',
        value: { nacionalidade: 'Inglesa' },
      },
      updateAmbos: {
        summary: 'Atualizar nome e nacionalidade',
        value: { nome: 'Madonna', nacionalidade: 'Americana' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Artista atualizado com sucesso.',
    schema: {
      example: { id: 1, nome: 'The Beatles (Remaster)', nacionalidade: 'Britânica' },
    },
  })
  @ApiResponse({ status: 404, description: 'Artista não encontrado.' })
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
  @ApiOperation({ summary: 'Remover um artista pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do artista a ser removido', example: 1 })
  @ApiResponse({ status: 204, description: 'Artista removido com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Artista possui músicas vinculadas e não pode ser removido.',
  })
  @ApiResponse({ status: 404, description: 'Artista não encontrado.' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.artistaService.delete({
      id: Number(id),
    });
  }
}
