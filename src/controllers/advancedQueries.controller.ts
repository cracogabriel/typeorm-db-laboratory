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
  _2_2_OUT_musicaComArtistaDTO,
  _2_2_OUT_tempoTotalPlaylistDTO,
  _2_2_OUT_musicasCurtasDTO,
  _2_4_OUT_rankPopularidadeArtistaDTO,
  _2_4_IN_comparacaoTop1DTO,
  _2_4_OUT_comparacaoTop1DTO,
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
}
