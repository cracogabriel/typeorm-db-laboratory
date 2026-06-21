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
  _1_1_OUT_playlistsUsuarioDTO,
  _1_2_IN_musicasPlaylistsUsuarioArtista,
  _1_2_OUT_musicasPlaylistsUsuarioArtista,
  _1_3_OUT_MusicasPlaylist,
  _1_4_OUT_artistasEsquecidos,
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

  @Post('_1_2_musicas_playlists_usuario_artista')
  @ApiOperation({ summary: 'Listar musicas em playlists de um usuário e de um artista' })
  @ApiBody({
    type: _1_2_IN_musicasPlaylistsUsuarioArtista,
  })
  @ApiResponse({
    status: 200,
    type: _1_2_OUT_musicasPlaylistsUsuarioArtista,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _1_2_musicasPlaylistsUsuarioArtista(@Body() dto_in: _1_2_IN_musicasPlaylistsUsuarioArtista): Promise<_1_2_OUT_musicasPlaylistsUsuarioArtista[]> {
    return this.advancedQueriesService._1_2_musicasPlaylistsUsuarioArtista(dto_in);
  }

  @Post('_1_3_musicas_playlist')
  @ApiOperation({ summary: 'Listar playlists e o total de músicas em cada uma' })
  @ApiResponse({
    status: 200,
    type: _1_1_OUT_playlistsUsuarioDTO,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _1_3_musicasPlaylist(): Promise<_1_3_OUT_MusicasPlaylist[]> {
    return this.advancedQueriesService._1_3_musicasPlaylist();
  }

  @Post('_1_4_artistas_esquecidos')
  @ApiOperation({ summary: 'Listar artisras cujas músicas não se encontram em nenhuma playlist' })
  @ApiResponse({
    status: 200,
    type: _1_4_OUT_artistasEsquecidos,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _1_4_artistasEsquecidos(): Promise<_1_4_OUT_artistasEsquecidos[]> {
    return this.advancedQueriesService._1_4_artistasEsquecidos();
  }
}
