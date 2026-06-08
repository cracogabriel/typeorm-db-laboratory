import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDTO {
  @ApiProperty({
    description: 'ID do usuário dono da playlist',
    example: 1,
  })
  id_usuario: number;

  @ApiProperty({
    description: 'Nome da playlist',
    example: 'Minhas Favoritas',
  })
  nome_playlist: string;
}

export class AddMusicToPlaylistDTO {
  @ApiProperty({
    description: 'ID da playlist',
    example: 1,
  })
  playlistId: number;

  @ApiProperty({
    description: 'ID da música',
    example: 5,
  })
  musicId: number;
}

export class RemoveMusicFromPlaylistDTO {
  @ApiProperty({
    description: 'ID da playlist',
    example: 1,
  })
  playlistId: number;

  @ApiProperty({
    description: 'ID da música',
    example: 5,
  })
  musicId: number;
}
