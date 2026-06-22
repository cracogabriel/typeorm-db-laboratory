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
  _5_12_IN_moverMusicaDTO,
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

  // 2.1.1 Playlists de um Usuário Específico
  // Implemente uma função para listar todas as Playlists de um USUARIO específico, usando o username como filtro (ex: 'Pablo'). O retorno deve incluir o nome da Playlist e a data de criação.
  async _1_1_playlistsUsuario(
    dto_in: _1_1_IN_playlistsUsuarioDTO,
  ): Promise<_1_1_OUT_playlistsUsuarioDTO[]> {
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

  // 2.1.2 Músicas em Playlists de um Artista
  // Encontre todas as Músicas que pertencem a qualquer Playlist criada por um USUARIO específico (ex: 'Josue'), e cujo ARTISTA seja 'Queen'. Esta consulta requer atravessar múltiplos relacionamentos e aplicar filtros em diferentes entidades.
  async _1_2_musicasPlaylistsUsuarioArtista(
    dto_in: _1_2_IN_musicasPlaylistsUsuarioArtista,
  ): Promise<_1_2_OUT_musicasPlaylistsUsuarioArtista[]> {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.usuario', 'usuario')
      .innerJoin('playlist.musicaPlaylists', 'mp')
      .innerJoin('mp.musica', 'musica')
      .innerJoin('musica.artista', 'artista')
      .select(['musica.titulo AS musicaNome', 'playlist.nome AS playlistNome'])
      .where('usuario.username = :username', {
        username: dto_in.usuarioNome,
      })
      .andWhere('artista.nome = :artista', {
        artista: dto_in.artistaNome,
      })
      .getRawMany<_1_2_OUT_musicasPlaylistsUsuarioArtista>();
  }

  // 2.1.3 Contagem de Músicas por Playlist
  // Liste o nome de todas as Playlists e o número total de Músicas que cada uma contém. A listagem deve ser ordenada da Playlist mais longa para a mais curta. (Foco em agregação e manipulação da chave composta da Playlist).
  async _1_3_musicasPlaylist(): Promise<_1_3_OUT_MusicasPlaylist[]> {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.musicaPlaylists', 'mp')
      .innerJoin('mp.musica', 'musica')
      .select('playlist.nome', 'playlistNome')
      .addSelect('COUNT(musica.id)', 'totalMusicas')
      .groupBy('playlist.nome')
      .orderBy('totalMusicas', 'DESC')
      .getRawMany<_1_3_OUT_MusicasPlaylist>();
  }

  // 2.1.4 Artistas Sem Músicas em Playlists
  // Identifique e liste todos os Artistas que não possuem nenhuma de suas Músicas adicionadas a nenhuma Playlist no sistema. (Foco em operadores NOT IN, LEFT JOIN ou EXCEPT).
  async _1_4_artistasEsquecidos(): Promise<_1_4_OUT_artistasEsquecidos[]> {
    return this.playlistRepository.manager
      .createQueryBuilder()
      .select('artista.nome', 'nome')
      .from('artista', 'artista')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('musica', 'musica')
          .innerJoin('musica.artista', 'a2')
          .innerJoin('musica.musicaPlaylists', 'mp')
          .where('a2.id = artista.id')
          .getQuery();

        return `NOT EXISTS ${subQuery}`;
      })
      .getRawMany<_1_4_OUT_artistasEsquecidos>();
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
      .where((subQueryBuilder) => {
        const subQuery = subQueryBuilder
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

  // 2.3. Chaves e Junções Complexas

  // 2.3.8 Busca em Tabela de Junção com Atributos Extras
  // Liste o título de todas as Músicas na playlist 'Rock do Pablo', incluindo a ordem_na_playlist de cada música.
  async _3_8_playlistsUsuario(): Promise<_3_8_OUT_playlistsUsuarioDTO[]> {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.musicaPlaylists', 'mp')
      .innerJoin('mp.musica', 'musica')
      .innerJoin('musica.artista', 'artista')
      .select([
        'musica.titulo AS musicaNome',
        'mp.ordemNaPlaylist AS musicaPlaylistOrdem',
      ])
      .andWhere('playlist.nome = :playlistNome', {
        playlistNome: 'Rock do Pablo',
      })
      .getRawMany<_3_8_OUT_playlistsUsuarioDTO>();
  }

  // 2.3.9 Busca por Chave Composta Invertida
  // Encontre o username do Usuário que é o dono da Playlist que contém a MUSICA 'Bohemian Rhapsody'. O filtro deve começar pela MUSICA e navegar de volta para o USUARIO.
  async _3_9_usuarioBohemian(): Promise<_3_9_OUT_usuarioBohemianDTO[]> {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .innerJoin('playlist.usuario', 'usuario')
      .innerJoin('playlist.musicaPlaylists', 'mp')
      .innerJoin('mp.musica', 'musica')
      .innerJoin('musica.artista', 'artista')
      .select(['usuario.username AS usuarioNome'])
      .andWhere('musica.titulo = :musicaNome', {
        musicaNome: 'Bohemian Rhapsody',
      })
      .distinct()
      .getRawMany<_3_9_OUT_usuarioBohemianDTO>();
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

  // 2.5 Teste de Transações e Concorrência

  // 2.5.12 Transferência Transacional de Música (Transferência Atômica)
  //  Implemente uma função que mova uma MUSICA de uma PLAYLIST para outra PLAYLIST (ambas do mesmo USUARIO), garantindo que o processo seja Atômico (ou tudo acontece ou nada acontece).
  async _5_12_moverMusica(dto_in: _5_12_IN_moverMusicaDTO) {
    await this.playlistRepository.manager.transaction(async (manager) => {
      const playlistOrigem = await manager.findOne(Playlist, {
        where: { playlistId: dto_in.playlistIdOrigem },
      });
      if (!playlistOrigem) throw new Error('Playlist de origem não encontrada');
      const playlistDestino = await manager.findOne(Playlist, {
        where: { playlistId: dto_in.playlistIdDestino },
      });
      if (!playlistDestino)
        throw new Error('Playlist de destino não encontrada');
      if (playlistOrigem.usuarioId != playlistDestino.usuarioId)
        throw new Error('A playlist de destino pertence a outro usuário');
      await this.addMusicToPlaylist(dto_in, manager);
      await this.removeMusicFromPlaylist(dto_in, manager);
    });
  }

  async addMusicToPlaylist(
    { playlistIdOrigem, musicaId, playlistIdDestino }: _5_12_IN_moverMusicaDTO,
    manager,
  ): Promise<MusicaPlaylist> {
    const playlist = await manager.findOne(Playlist, {
      where: { playlistId: playlistIdDestino },
    });
    if (!playlist) throw new Error('Playlist não encontrada');

    const music = await manager.findOne(Musica, {
      where: { id: musicaId },
    });
    if (!music) throw new Error('Música não encontrada');

    // calcula a próxima ordem contando quantas músicas já existem na playlist
    const totalMusicas = await manager.count(MusicaPlaylist, {
      where: {
        playlistId: playlist.playlistId,
        usuarioId: playlist.usuarioId,
      },
    });

    const ordemNaPlaylist = totalMusicas + 1;

    const musicaPlaylist = manager.create(MusicaPlaylist, {
      musicaId: musicaId,
      playlistId: playlist.playlistId,
      usuarioId: playlist.usuarioId, // obrigatório, faz parte da PK composta
      ordemNaPlaylist, // próxima posição na ordem
    });

    return manager.save(MusicaPlaylist, musicaPlaylist);
  }

  async removeMusicFromPlaylist(
    { playlistIdOrigem, musicaId, playlistIdDestino }: _5_12_IN_moverMusicaDTO,
    manager,
  ): Promise<void> {
    const playlist = await manager.findOne(Playlist, {
      where: { playlistId: playlistIdOrigem },
    });
    if (!playlist) throw new Error('Playlist não encontrada');
    const musicaPlaylist = await manager.findOne(MusicaPlaylist, {
      where: {
        playlistId: playlist.playlistId,
        usuarioId: playlist.usuarioId,
        musicaId: musicaId,
      },
    });
    if (!musicaPlaylist) throw new Error('Música não encontrada na playlist');
    const ordemRemovida = musicaPlaylist.ordemNaPlaylist;
    await manager.delete(MusicaPlaylist, {
      playlistId: playlist.playlistId,
      usuarioId: playlist.usuarioId,
      musicaId: musicaId,
    });
    await manager
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
