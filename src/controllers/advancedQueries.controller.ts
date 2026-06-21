import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AdvancedQueriesService } from '../services/advancedQueries.service';
import {
  _1_1_IN_playlistsUsuarioDTO,
  _1_1_OUT_playlistsUsuarioDTO,
  _1_2_IN_musicasPlaylistsUsuarioArtista,
  _1_2_OUT_musicasPlaylistsUsuarioArtista,
  _1_3_OUT_MusicasPlaylist,
  _1_4_OUT_artistasEsquecidos,
  _2_2_OUT_musicaComArtistaDTO,
  _2_2_OUT_tempoTotalPlaylistDTO,
  _2_2_OUT_musicasCurtasDTO,
  _2_4_OUT_rankPopularidadeArtistaDTO,
  _2_4_IN_comparacaoTop1DTO,
  _2_4_OUT_comparacaoTop1DTO,
  _3_8_OUT_playlistsUsuarioDTO,
  _3_9_OUT_usuarioBohemianDTO,
  _5_12_IN_moverMusicaDTO
} from '../interfaces/advancedQueries.interface';

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

  // --- 2.2 ---

  @Get('_2_2_musica_com_artista/:id')
  @ApiOperation({ summary: '2.2 - Detalhes completos da música com artista (Eager Loading / Join Fetch)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da música', example: 1 })
  @ApiResponse({
    status: 200,
    type: _2_2_OUT_musicaComArtistaDTO,
  })
  async _2_2_musicaComArtista(@Param('id', ParseIntPipe) id: number) {
    return this.advancedQueriesService._2_2_musicaComArtista(id);
  }

  @Get('_2_2_tempo_total_playlists')
  @ApiOperation({ summary: '2.2 - Tempo total de reprodução de cada playlist (SUM + GROUP BY)' })
  @ApiResponse({
    status: 200,
    type: _2_2_OUT_tempoTotalPlaylistDTO,
    isArray: true,
  })
  async _2_2_tempoTotalPlaylists() {
    return this.advancedQueriesService._2_2_tempoTotalPlaylists();
  }

  @Get('_2_2_musicas_curtas_que_media')
  @ApiOperation({ summary: '2.2 - Músicas mais curtas que a média do seu artista (Subconsulta)' })
  @ApiResponse({
    status: 200,
    type: _2_2_OUT_musicasCurtasDTO,
    isArray: true,
  })
  async _2_2_musicasCurtasQueMedia() {
    return this.advancedQueriesService._2_2_musicasCurtasQueMedia();
  }

  // --- 2.4 ---

  @Get('_2_4_rank_popularidade_artista')
  @ApiOperation({ summary: '2.4 - Rank de popularidade do artista por número de playlists' })
  @ApiResponse({
    status: 200,
    type: _2_4_OUT_rankPopularidadeArtistaDTO,
    isArray: true,
  })
  async _2_4_rankPopularidadeArtista() {
    return this.advancedQueriesService._2_4_rankPopularidadeArtista();
  }

  @Post('_2_4_comparacao_top1')
  @ApiOperation({ summary: '2.4 - Músicas de um artista com duração maior que a mais longa de outro artista (Subconsulta Correlacionada)' })
  @ApiBody({
    type: _2_4_IN_comparacaoTop1DTO,
  })
  @ApiResponse({
    status: 200,
    type: _2_4_OUT_comparacaoTop1DTO,
    isArray: true,
  })
  async _2_4_comparacaoTop1(@Body() dto_in: _2_4_IN_comparacaoTop1DTO) {
    return this.advancedQueriesService._2_4_comparacaoTop1(dto_in);
  }

  // 2.3

  @Post('_3_8_playlists_usuario')
  @ApiOperation({ summary: 'Musicas da playlist "Rock do Plablo"' })
  @ApiResponse({
    status: 200,
    type: _3_8_OUT_playlistsUsuarioDTO,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _3_8_playlistsUsuario(): Promise<_3_8_OUT_playlistsUsuarioDTO[]> {
    return this.advancedQueriesService._3_8_playlistsUsuario();
  }

  @Post('_3_9_usuario_bohemian')
  @ApiOperation({ summary: 'Usuários que escutam "Bohemian Rhapsody"' })
  @ApiResponse({
    status: 200,
    type: _3_9_OUT_usuarioBohemianDTO,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _3_9_usuarioBohemian(): Promise<_3_9_OUT_usuarioBohemianDTO[]> {
    return this.advancedQueriesService._3_9_usuarioBohemian();
  }

  @Post('_5_12_mover_musica')
  @ApiOperation({ summary: 'Listar playlists de um usuário' })
  @ApiBody({
    type: _5_12_IN_moverMusicaDTO,
  })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async _5_12_moverMusica(@Body() dto_in: _5_12_IN_moverMusicaDTO) {
    return this.advancedQueriesService._5_12_moverMusica(dto_in);
  }
}
