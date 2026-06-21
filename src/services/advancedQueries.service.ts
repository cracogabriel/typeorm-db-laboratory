import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppDataSource } from "../data-source";
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import {
  _1_1_IN_playlistsUsuarioDTO,
  _1_1_OUT_playlistsUsuarioDTO,
  _1_2_IN_musicasPlaylistsUsuarioArtista,
  _1_2_OUT_musicasPlaylistsUsuarioArtista,
  _1_3_OUT_MusicasPlaylist,
  _1_4_OUT_artistasEsquecidos,
} from 'src/interfaces/advancedQueries.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AdvancedQueriesService {

  constructor(
      @InjectRepository(Playlist)
      private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async _1_1_playlistsUsuario(dto_in: _1_1_IN_playlistsUsuarioDTO): Promise<_1_1_OUT_playlistsUsuarioDTO[]> {
    return this.playlistRepository
      .createQueryBuilder("playlist")
      .innerJoin("playlist.usuario", "usuario")
      .select([
        "playlist.nome AS nome",
        "playlist.dataCriacao AS dataCriacao"
      ])
      .where("usuario.username = :username", {
        username: dto_in.nome,
      })
      .orderBy("playlist.dataCriacao", "ASC")
      .getRawMany<_1_1_OUT_playlistsUsuarioDTO>();
  }

  async _1_2_musicasPlaylistsUsuarioArtista(
    dto_in: _1_2_IN_musicasPlaylistsUsuarioArtista,
  ): Promise<_1_2_OUT_musicasPlaylistsUsuarioArtista[]> {
    return this.playlistRepository
      .createQueryBuilder("playlist")
      .innerJoin("playlist.usuario", "usuario")
      .innerJoin("playlist.musicaPlaylists", "mp")
      .innerJoin("mp.musica", "musica")
      .innerJoin("musica.artista", "artista")
      .select([
        "musica.titulo AS musicaNome",
        "playlist.nome AS playlistNome",
      ])
      .where("usuario.username = :username", {
        username: dto_in.usuarioNome,
      })
      .andWhere("artista.nome = :artista", {
        artista: dto_in.artistaNome,
      })
      .getRawMany<_1_2_OUT_musicasPlaylistsUsuarioArtista>();
  }

  async _1_3_musicasPlaylist(): Promise<_1_3_OUT_MusicasPlaylist[]> {
    return this.playlistRepository
      .createQueryBuilder("playlist")
      .innerJoin("playlist.musicaPlaylists", "mp")
      .innerJoin("mp.musica", "musica")
      .select("playlist.nome", "playlistNome")
      .addSelect("COUNT(musica.id)", "totalMusicas")
      .groupBy("playlist.nome")
      .orderBy("totalMusicas", "DESC")
      .getRawMany<_1_3_OUT_MusicasPlaylist>();
  }

  async _1_4_artistasEsquecidos(): Promise<_1_4_OUT_artistasEsquecidos[]> {
    return this.playlistRepository.manager
      .createQueryBuilder()
      .select("artista.nome", "nome")
      .from("artista", "artista")
      .where(qb => {
        const sub = qb
          .subQuery()
          .select("1")
          .from("musica", "musica")
          .innerJoin("musica.artista", "a2")
          .innerJoin("musica.musicaPlaylists", "mp")
          .where("a2.id = artista.id")
          .getQuery();

        return "NOT EXISTS " + sub;
      })
      .getRawMany<_1_4_OUT_artistasEsquecidos>();
  }
}
