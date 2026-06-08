import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMusicaDTO {
  @ApiProperty({
    description: 'Título da música',
    example: 'Hey Jude',
  })
  titulo: string;

  @ApiProperty({
    description: 'Duração da música em segundos (deve ser maior que 0)',
    example: 431,
  })
  duracaoSegundos: number;

  @ApiProperty({
    description: 'ID do artista ao qual a música pertence',
    example: 1,
  })
  artistaId: number;
}

export class RetrieveMusicaDTO {
  @ApiPropertyOptional({
    description: 'ID da música (use id OU titulo, não ambos)',
    example: 1,
  })
  id?: number;

  @ApiPropertyOptional({
    description: 'Título da música (use id OU titulo, não ambos)',
    example: 'Hey Jude',
  })
  titulo?: string;
}

export class UpdateMusicaDTO {
  @ApiProperty({
    description: 'ID da música a ser atualizada',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'Novo título da música',
    example: 'Hey Jude (Remaster)',
  })
  titulo?: string;

  @ApiPropertyOptional({
    description: 'Nova duração em segundos (deve ser maior que 0)',
    example: 435,
  })
  duracaoSegundos?: number;

  @ApiPropertyOptional({
    description: 'Novo ID do artista',
    example: 2,
  })
  artistaId?: number;
}

export class DeleteMusicaDTO {
  @ApiProperty({
    description: 'ID da música a ser removida',
    example: 1,
  })
  id: number;
}
