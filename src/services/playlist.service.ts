import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Musica } from 'src/entities/musica.entity';
import { MusicaPlaylist } from 'src/entities/musica-playlist.entity';
import { Playlist } from 'src/entities/playlist.entity';
import {
  AddMusicToPlaylistDTO,
  CreatePlaylistDTO,
  RemoveMusicFromPlaylistDTO,
} from 'src/interfaces/playlist.interface';
import { Repository } from 'typeorm';
import { Usuario } from 'src/entities/usuario.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Musica)
    private readonly musicaRepository: Repository<Musica>,
    @InjectRepository(MusicaPlaylist)
    private readonly musicaPlaylistRepository: Repository<MusicaPlaylist>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>, // ← repositório correto
  ) {}

  async create(createDTO: CreatePlaylistDTO): Promise<Playlist> {
    const user = await this.usuarioRepository.findOne({
      where: { id: createDTO.id_usuario },
    });

    if (!user) throw new Error('Usuário não encontrado');

    const playlist = this.playlistRepository.create({
      usuarioId: createDTO.id_usuario,
      nome: createDTO.nome_playlist,
    });

    return this.playlistRepository.save(playlist);
  }

  async addMusicToPlaylist({
    playlistId,
    musicId,
  }: AddMusicToPlaylistDTO): Promise<MusicaPlaylist> {
    const playlist = await this.playlistRepository.findOne({
      where: { playlistId },
    });
    if (!playlist) throw new Error('Playlist não encontrada');

    const music = await this.musicaRepository.findOne({
      where: { id: musicId },
    });
    if (!music) throw new Error('Música não encontrada');

    // calcula a próxima ordem contando quantas músicas já existem na playlist
    const totalMusicas = await this.musicaPlaylistRepository.count({
      where: {
        playlistId: playlist.playlistId,
        usuarioId: playlist.usuarioId,
      },
    });

    const ordemNaPlaylist = totalMusicas + 1;

    const musicaPlaylist = this.musicaPlaylistRepository.create({
      musicaId: musicId,
      playlistId: playlist.playlistId,
      usuarioId: playlist.usuarioId, // obrigatório, faz parte da PK composta
      ordemNaPlaylist, // próxima posição na ordem
    });

    return this.musicaPlaylistRepository.save(musicaPlaylist);
  }

  async removeMusicFromPlaylist({
    playlistId,
    musicId,
  }: RemoveMusicFromPlaylistDTO): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      where: { playlistId },
    });
    if (!playlist) throw new Error('Playlist não encontrada');

    const musicaPlaylist = await this.musicaPlaylistRepository.findOne({
      where: {
        playlistId: playlist.playlistId,
        usuarioId: playlist.usuarioId,
        musicaId: musicId,
      },
    });
    if (!musicaPlaylist) throw new Error('Música não encontrada na playlist');

    const ordemRemovida = musicaPlaylist.ordemNaPlaylist;

    await this.musicaPlaylistRepository.delete({
      playlistId: playlist.playlistId,
      usuarioId: playlist.usuarioId,
      musicaId: musicId,
    });

    // reordena as músicas que vinham depois da removida
    await this.musicaPlaylistRepository
      .createQueryBuilder()
      .update(MusicaPlaylist)
      .set({ ordemNaPlaylist: () => 'ordem_na_playlist - 1' })
      .where(
        'playlist_id = :playlistId AND usuario_id = :usuarioId AND ordem_na_playlist > :ordemRemovida',
        {
          playlistId: playlist.playlistId,
          usuarioId: playlist.usuarioId,
          ordemRemovida,
        },
      )
      .execute();
  }
}
