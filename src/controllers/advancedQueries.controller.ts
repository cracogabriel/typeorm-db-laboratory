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
import { AdvancedQueriesService } from '../services/advancedQueries.service';
import {
  _1_1_IN_playlistsUsuarioDTO,
  _1_1_OUT_playlistsUsuarioDTO
} from '../interfaces/advancedQueries.interface';
import { Artista } from '../entities/artista.entity';

@ApiTags('AdvancedQueries')
@Controller('AdvancedQueries')
export class AdvancedQueriesController {
  constructor(private readonly advancedQueriesService: AdvancedQueriesService) {}

  @Post('_1_1_playlists_usuario')
  @ApiOperation({ summary: 'Listar playlists de um usuário' })
  @ApiBody({
    type: _1_1_IN_playlistsUsuarioDTO,
  })
  @ApiResponse({
    status: 200,
    type: _1_1_OUT_playlistsUsuarioDTO,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _1_1_playlistsUsuario(@Body() dto_in: _1_1_IN_playlistsUsuarioDTO): Promise<_1_1_OUT_playlistsUsuarioDTO[]> {
    return this.advancedQueriesService._1_1_playlistsUsuario(dto_in);
  }
}
