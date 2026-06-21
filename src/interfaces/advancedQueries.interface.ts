import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
