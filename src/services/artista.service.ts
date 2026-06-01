import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
export class ArtistaService {
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

  async retrieve(retrieveDTO: RetrieveArtistaDTO): Promise<Artista> {
    if (!retrieveDTO.id && !retrieveDTO.nome) {
      throw new BadRequestException(
        'É necessário informar o id ou o nome para busca',
      );
    }

    const artista = await this.artistRepository.findOne({
      where: {
        ...(retrieveDTO.id && { id: retrieveDTO.id }),
        ...(retrieveDTO.nome && { nome: retrieveDTO.nome }),
      },
      relations: { musicas: true },
    });

    if (!artista) {
      throw new NotFoundException('Artista não encontrado');
    }

    return artista;
  }

  async update(updateDTO: UpdateArtistaDTO): Promise<Artista> {
    const artista = await this.artistRepository.findOne({
      where: { id: updateDTO.id },
    });

    if (!artista) {
      throw new NotFoundException('Artista não encontrado');
    }

    artista.nome = updateDTO.nome ?? artista.nome;
    artista.nacionalidade = updateDTO.nacionalidade ?? artista.nacionalidade;

    return await this.artistRepository.save(artista);
  }

  async delete(deleteDTO: DeleteArtistaDTO): Promise<void> {
    const artista = await this.artistRepository.findOne({
      where: { id: deleteDTO.id },
      relations: { musicas: true },
    });

    if (!artista) {
      throw new NotFoundException('Artista não encontrado');
    }

    if (artista.musicas && artista.musicas.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir o artista pois ele possui músicas associadas',
      );
    }

    await this.artistRepository.remove(artista);
  }
}
