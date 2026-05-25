import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artista } from 'src/entities/artista.entity';
import {
  CreateArtistaDTO,
  UpdateArtistaDTO,
} from 'src/interfaces/artista.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artista)
    private readonly artistRepository: Repository<Artista>,
  ) {}

  async create(createDTO: CreateArtistaDTO): Promise<Artista> {
    const entity = this.artistRepository.create({
      nome: createDTO.nome,
      nacionalidade: createDTO.nacionalidade,
    }); // cria objeto

    return await this.artistRepository.save(entity); // salva o objeto no banco de dados
  }
  async retrieve(retrieveDTO: RetrieveArtistaDTO): Promise<Artista> {}
  async update(updateDTO: UpdateArtistaDTO): Promise<Artista> {}
  async delete(deleteDTO: DeleteArtistaDTO): Promise<void> {}
}
