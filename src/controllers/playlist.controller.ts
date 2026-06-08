import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PlaylistService } from '../services/playlist.service';
import { CreatePlaylistDTO } from '../interfaces/playlist.interface';
import { Playlist } from '../entities/playlist.entity';
import { MusicaPlaylist } from '../entities/musica-playlist.entity';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova playlist' })
  @ApiBody({
    type: CreatePlaylistDTO,
    examples: {
      minhasFavoritas: {
        summary: 'Playlist de favoritos',
        value: { id_usuario: 1, nome_playlist: 'Minhas Favoritas' },
      },
      rockClassico: {
        summary: 'Playlist de rock clássico',
        value: { id_usuario: 2, nome_playlist: 'Rock Clássico dos Anos 70' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Playlist criada com sucesso.',
    schema: {
      example: {
        playlistId: 1,
        usuarioId: 1,
        nome: 'Minhas Favoritas',
        dataCriacao: '2026-06-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário não encontrado.' })
  async create(@Body() createDTO: CreatePlaylistDTO): Promise<Playlist> {
    return this.playlistService.create(createDTO);
  }

  @Post(':playlistId/musicas/:musicId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar uma música a uma playlist' })
  @ApiParam({
    name: 'playlistId',
    description: 'ID da playlist',
    example: 1,
  })
  @ApiParam({
    name: 'musicId',
    description: 'ID da música a adicionar',
    example: 5,
  })
  @ApiResponse({
    status: 201,
    description: 'Música adicionada à playlist com sucesso.',
    schema: {
      example: {
        playlistId: 1,
        musicaId: 5,
        ordemNaPlaylist: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Playlist ou música não encontrada.' })
  @ApiResponse({ status: 409, description: 'Música já existe nesta playlist.' })
  async addMusicToPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('musicId') musicId: string,
  ): Promise<MusicaPlaylist> {
    return this.playlistService.addMusicToPlaylist({
      playlistId: Number(playlistId),
      musicId: Number(musicId),
    });
  }

  @Delete(':playlistId/musicas/:musicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma música de uma playlist' })
  @ApiParam({
    name: 'playlistId',
    description: 'ID da playlist',
    example: 1,
  })
  @ApiParam({
    name: 'musicId',
    description: 'ID da música a remover',
    example: 5,
  })
  @ApiResponse({ status: 204, description: 'Música removida da playlist com sucesso.' })
  @ApiResponse({ status: 404, description: 'Relação playlist-música não encontrada.' })
  async removeMusicFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('musicId') musicId: string,
  ): Promise<void> {
    return this.playlistService.removeMusicFromPlaylist({
      playlistId: Number(playlistId),
      musicId: Number(musicId),
    });
  }
}
