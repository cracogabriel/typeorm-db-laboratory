import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlaylistService } from '../services/playlist.service';
import { CreatePlaylistDTO } from '../interfaces/playlist.interface';
import { Playlist } from '../entities/playlist.entity';
import { MusicaPlaylist } from '../entities/musica-playlist.entity';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDTO: CreatePlaylistDTO): Promise<Playlist> {
    return this.playlistService.create(createDTO);
  }

  @Post(':playlistId/musicas/:musicId')
  @HttpCode(HttpStatus.CREATED)
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
