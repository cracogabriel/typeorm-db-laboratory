import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArtistaDTO {
  @ApiProperty({
    description: 'Nome do artista',
    example: 'The Beatles',
  })
  nome: string;

  @ApiProperty({
    description: 'Nacionalidade do artista',
    example: 'Britânica',
  })
  nacionalidade: string;
}

export class UpdateArtistaDTO {
  @ApiProperty({
    description: 'ID do artista a ser atualizado',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'Novo nome do artista',
    example: 'The Beatles (Remastered)',
  })
  nome?: string;

  @ApiPropertyOptional({
    description: 'Nova nacionalidade do artista',
    example: 'Inglesa',
  })
  nacionalidade?: string;
}

export class RetrieveArtistaDTO {
  @ApiPropertyOptional({
    description: 'ID do artista (use id OU nome, não ambos)',
    example: 1,
  })
  id?: number;

  @ApiPropertyOptional({
    description: 'Nome do artista (use id OU nome, não ambos)',
    example: 'The Beatles',
  })
  nome?: string;
}

export class DeleteArtistaDTO {
  @ApiProperty({
    description: 'ID do artista a ser removido',
    example: 1,
  })
  id: number;
}
