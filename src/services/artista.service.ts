import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artista } from 'src/entities/artista.entity';
import {
  CreateArtistaDTO,
  RetrieveArtistaDTO,
  UpdateArtistaDTO,
  DeleteArtistaDTO,
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
    });

    return await this.artistRepository.save(entity);
  }

  async retrieve(
    retrieveDTO: RetrieveArtistaDTO,
  ): Promise<Artista> {
    const artista = await this.artistRepository.findOne({
      where: {
        ...(retrieveDTO.id && { id: retrieveDTO.id }),
        ...(retrieveDTO.nome && { nome: retrieveDTO.nome }),
      },
      relations: ['musicas'],
    });

    if (!artista) {
      throw new NotFoundException('Artista não encontrado');
    }

    return artista;
  }

  async update(
    updateDTO: UpdateArtistaDTO,
  ): Promise<Artista> {
    const artista = await this.artistRepository.findOne({
      where: { id: updateDTO.id },
    });

    if (!artista) {
      throw new NotFoundException('Artista não encontrado');
    }

    artista.nome = updateDTO.nome ?? artista.nome;
    artista.nacionalidade =
      updateDTO.nacionalidade ?? artista.nacionalidade;

    return await this.artistRepository.save(artista);
  }

  async delete(
    deleteDTO: DeleteArtistaDTO,
  ): Promise<void> {
    const result = await this.artistRepository.delete(
      deleteDTO.id,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Artista não encontrado');
    }
  }
}
