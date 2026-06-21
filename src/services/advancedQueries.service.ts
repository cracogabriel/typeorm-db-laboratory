import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { Musica } from 'src/entities/musica.entity';
import { Artista } from 'src/entities/artista.entity';
import { MusicaPlaylist } from 'src/entities/musica-playlist.entity';
import {
  _1_1_IN_playlistsUsuarioDTO,
  _1_1_OUT_playlistsUsuarioDTO,
  _2_2_OUT_musicaComArtistaDTO,
  _2_2_OUT_tempoTotalPlaylistDTO,
  _2_2_OUT_musicasCurtasDTO,
  _2_4_OUT_rankPopularidadeArtistaDTO,
  _2_4_IN_comparacaoTop1DTO,
  _2_4_OUT_comparacaoTop1DTO,
} from 'src/interfaces/advancedQueries.interface';

@Injectable()
export class AdvancedQueriesService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Musica)
    private readonly musicaRepository: Repository<Musica>,
    @InjectRepository(Artista)
    private readonly artistaRepository: Repository<Artista>,
    @InjectRepository(MusicaPlaylist)
    private readonly musicaPlaylistRepository: Repository<MusicaPlaylist>,
  ) {}

  async _1_1_playlistsUsuario(dto_in: _1_1_IN_playlistsUsuarioDTO) {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.usuario', 'usuario')
      .select(['playlist.nome AS nome', 'playlist.dataCriacao AS dataCriacao'])
      .where('usuario.username = :username', {
        username: dto_in.nome,
      })
      .orderBy('playlist.dataCriacao', 'ASC')
      .getRawMany<_1_1_OUT_playlistsUsuarioDTO>();
  }

  // 2.2 - Detalhes Completos da Música com Artista (Eager Loading / Fetching Join)
  // Detalhes Completos da Música com Artista: Crie uma função para buscar uma Música por seu id e, em uma única operação de consulta (evitando o problema N+1), carregue (fetch) automaticamente todos os detalhes do Artista relacionado. (Foco em Eager Loading ou Fetching Join).
  async _2_2_musicaComArtista(id: number) {
    return this.musicaRepository
      .createQueryBuilder('musica')
      .innerJoinAndSelect('musica.artista', 'artista')
      .select([
        'musica.id AS musica_id',
        'musica.titulo AS musica_titulo',
        'musica.duracaoSegundos AS "musica_duracaoSegundos"',
        'artista.id AS artista_id',
        'artista.nome AS artista_nome',
        'artista.nacionalidade AS artista_nacionalidade',
      ])
      .where('musica.id = :id', { id })
      .getRawOne<_2_2_OUT_musicaComArtistaDTO>();
  }

  // 2.2 - Tempo Total de Reprodução da Playlist (Agregação SUM e GROUP BY sobre N:N)
  // Tempo Total de Reprodução da Playlist: Para cada PLAYLIST no sistema, calcule e retorne o tempo total de reprodução (soma de duracao_segundos de todas as músicas). A saída deve listar o nome da Playlist, o username do Dono e o tempo total de reprodução. (Foco em agregação SUM e GROUP BY sobre o N:N).
  async _2_2_tempoTotalPlaylists() {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.usuario', 'usuario')
      .leftJoin('playlist.musicaPlaylists', 'mp')
      .leftJoin('mp.musica', 'musica')
      .select([
        'playlist.nome AS playlist_nome',
        'usuario.username AS dono_username',
        'COALESCE(SUM(musica.duracaoSegundos), 0) AS tempo_total_segundos',
      ])
      .groupBy('playlist.playlistId')
      .addGroupBy('playlist.nome')
      .addGroupBy('usuario.username')
      .getRawMany<_2_2_OUT_tempoTotalPlaylistDTO>();
  }

  // 2.2 - Músicas Mais Curtas que a Média do Artista (Subconsulta)
  // Músicas Mais Curtas que a Média do Artista: Liste todas as Músicas cujo tempo de duração (duracao_segundos) é menor que o tempo de duração médio de todas as músicas do seu próprio Artista (ex: listar músicas do AC/DC que são mais curtas que a média do AC/DC). (Foco em subconsultas ou Window Functions se o ORM suportar).
  async _2_2_musicasCurtasQueMedia() {
    return this.musicaRepository
      .createQueryBuilder('musica')
      .innerJoin('musica.artista', 'artista')
      .select([
        'musica.id AS musica_id',
        'musica.titulo AS musica_titulo',
        'musica.duracaoSegundos AS duracao_segundos',
        'artista.nome AS artista_nome',
      ])
      .where((qb) => {
        const subQuery = qb
          .subQuery() // Query that can be used inside other queries.
          .select('AVG(m2.duracaoSegundos)')
          .from(Musica, 'm2')
          .where('m2.artistaId = musica.artistaId')
          .getQuery();
        return `musica.duracaoSegundos < (${subQuery})`;
      })
      .orderBy('artista.nome', 'ASC')
      .addOrderBy('musica.duracaoSegundos', 'ASC')
      .getRawMany<_2_2_OUT_musicasCurtasDTO>();
  }

  // 2.4 - Rank de Popularidade do Artista (Window Function / Ranking)
  // Rank de Popularidade do Artista: Liste todos os Artistas e seu ranking baseado no número de Playlists em que suas músicas estão presentes (o Artista com músicas na maior quantidade de playlists fica em 1º).
  async _2_4_rankPopularidadeArtista() {
    return this.artistaRepository
      .createQueryBuilder('artista')
      .leftJoin('artista.musicas', 'musica')
      .leftJoin('musica.musicaPlaylists', 'mp')
      .select([
        'artista.id AS artista_id',
        'artista.nome AS artista_nome',
        'COUNT(DISTINCT mp.playlistId) AS total_playlists',
        'RANK() OVER (ORDER BY COUNT(DISTINCT mp.playlistId) DESC) AS rank',
      ])
      .groupBy('artista.id')
      .addGroupBy('artista.nome')
      .orderBy('rank', 'ASC')
      .getRawMany<_2_4_OUT_rankPopularidadeArtistaDTO>();
  }

  // 2.4 - Comparação com o Top 1 (Subconsulta Correlacionada)
  // Comparação com o Top 1 (Desafio de Subconsulta Correlacionada): Liste todas as Músicas do Artista 'Led Zeppelin' cuja duração é maior que a duração da música mais longa do Artista 'Queen'.
  // O Desafio do ORM: Força o uso de subconsultas complexas (WHERE duracao_segundos > (SELECT MAX(...) FROM MUSICA WHERE artista_id = X)). Muitos ORMs têm sintaxe pobre ou geram SQL ineficiente para subconsultas não correlacionadas.
  async _2_4_comparacaoTop1(dto_in: _2_4_IN_comparacaoTop1DTO) {
    return this.musicaRepository
      .createQueryBuilder('musica')
      .innerJoin('musica.artista', 'artista')
      .select([
        'musica.id AS musica_id',
        'musica.titulo AS musica_titulo',
        'musica.duracaoSegundos AS duracao_segundos',
        'artista.nome AS artista_nome',
      ])
      .where('artista.nome = :artistaNome', { artistaNome: dto_in.artistaNome })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(m2.duracaoSegundos)')
          .from(Musica, 'm2')
          .innerJoin('m2.artista', 'a2')
          .where('a2.nome = :artistaReferenciaNome')
          .getQuery();
        return `musica.duracaoSegundos > (${subQuery})`;
      })
      .setParameter('artistaReferenciaNome', dto_in.artistaReferenciaNome)
      .orderBy('musica.duracaoSegundos', 'DESC')
      .getRawMany<_2_4_OUT_comparacaoTop1DTO>();
  }
}
