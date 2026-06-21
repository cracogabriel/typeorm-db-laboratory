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