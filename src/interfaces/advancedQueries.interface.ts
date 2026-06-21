import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntegerType } from 'typeorm/driver/mongodb/typings.js';

export class _1_1_IN_playlistsUsuarioDTO {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Ben',
  })
  nome: string;
}

export class _1_1_OUT_playlistsUsuarioDTO {
  nome: string;
  dataCriacao: Date;
}

export class _1_2_IN_musicasPlaylistsUsuarioArtista {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Ben',
  })
  usuarioNome: string;
  @ApiProperty({
    description: 'Nome do artista',
    example: 'The Beatles',
  })
  artistaNome: string;
}

export class _1_2_OUT_musicasPlaylistsUsuarioArtista {
  musicaNome: string;
  playlistNome: string;
}

export class _1_3_OUT_MusicasPlaylist {
  playlistNome: string;
  totalMusicas: IntegerType;
}

export class _1_4_OUT_artistasEsquecidos {
  artistaNome: string;
}

// 2.2

export class _2_2_OUT_musicaComArtistaDTO {
  @ApiProperty({ example: 1 })
  musica_id: number;

  @ApiProperty({ example: 'Stairway to Heaven' })
  musica_titulo: string;

  @ApiProperty({ example: 482 })
  musica_duracaoSegundos: number;

  @ApiProperty({ example: 1 })
  artista_id: number;

  @ApiProperty({ example: 'Led Zeppelin' })
  artista_nome: string;

  @ApiProperty({ example: 'Britânica' })
  artista_nacionalidade: string;
}

export class _2_2_OUT_tempoTotalPlaylistDTO {
  @ApiProperty({ example: 'Minha Playlist' })
  playlist_nome: string;

  @ApiProperty({ example: 'Ben' })
  dono_username: string;

  @ApiProperty({ example: 3600 })
  tempo_total_segundos: number;
}

export class _2_2_OUT_musicasCurtasDTO {
  @ApiProperty({ example: 1 })
  musica_id: number;

  @ApiProperty({ example: 'Short Song' })
  musica_titulo: string;

  @ApiProperty({ example: 120 })
  duracao_segundos: number;

  @ApiProperty({ example: 200 })
  media_artista: number;

  @ApiProperty({ example: 'Led Zeppelin' })
  artista_nome: string;
}

// 2.4

export class _2_4_OUT_rankPopularidadeArtistaDTO {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: 1 })
  artista_id: number;

  @ApiProperty({ example: 'Led Zeppelin' })
  artista_nome: string;

  @ApiProperty({ example: 5 })
  total_playlists: number;
}

export class _2_4_IN_comparacaoTop1DTO {
  @ApiProperty({
    description: 'Nome do artista cujas músicas serão listadas',
    example: 'Led Zeppelin',
  })
  artistaNome: string;

  @ApiProperty({
    description: 'Nome do artista de referência (top 1)',
    example: 'Queen',
  })
  artistaReferenciaNome: string;
}

export class _2_4_OUT_comparacaoTop1DTO {
  @ApiProperty({ example: 1 })
  musica_id: number;

  @ApiProperty({ example: 'Stairway to Heaven' })
  musica_titulo: string;

  @ApiProperty({ example: 482 })
  duracao_segundos: number;

  @ApiProperty({ example: 'Led Zeppelin' })
  artista_nome: string;
}

// 2.3

export class _3_8_OUT_playlistsUsuarioDTO {
  musicaNome: string;
  musicaPlaylistOrdem: IntegerType;
}

export class _3_9_OUT_usuarioBohemianDTO {
  usuarioNome: string;
}

export class _5_12_IN_moverMusicaDTO{
  @ApiProperty({
    description: 'ID da playlist original',
    example: 1,
  })
  playlistIdOrigem: number;
  @ApiProperty({
    description: 'ID da playlist de destino',
    example: 2,
  })
  playlistIdDestino: number;

  @ApiProperty({
    description: 'ID da música',
    example: 5,
  })
  musicaId: number;
}
