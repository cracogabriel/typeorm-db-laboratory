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