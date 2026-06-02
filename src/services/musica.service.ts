import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artista } from 'src/entities/artista.entity';
import { Musica } from 'src/entities/musica.entity';
import {
  CreateMusicaDTO,
  RetrieveMusicaDTO,
  UpdateMusicaDTO,
  DeleteMusicaDTO,
} from 'src/interfaces/musica.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MusicaService {
  constructor(
    @InjectRepository(Musica)
    private readonly musicRepository: Repository<Musica>,
    @InjectRepository(Artista)
    private readonly artistRepository: Repository<Artista>,
  ) {}

  async create(createDTO: CreateMusicaDTO): Promise<Musica> {
    if (createDTO.duracaoSegundos <= 0) {
      throw new BadRequestException(
        'A duração da música deve ser maior que zero',
      );
    }

    const artistExists = await this.artistRepository.exists({
      where: { id: createDTO.artistaId },
    });

    if (!artistExists) {
      throw new NotFoundException('Artista não encontrado');
    }

    const entity = this.musicRepository.create({
      titulo: createDTO.titulo,
      duracaoSegundos: createDTO.duracaoSegundos,
      artistaId: createDTO.artistaId,
    });

    return await this.musicRepository.save(entity);
  }

  async retrieve(retrieveDTO: RetrieveMusicaDTO): Promise<Musica> {
    if ((retrieveDTO.id && retrieveDTO.titulo) || (!retrieveDTO.id && !retrieveDTO.titulo)) {
      throw new BadRequestException(
        'Deve ser fornecido ou o id ou o título da música (apenas um deles).',
      );
    }

    const musica = await this.musicRepository.findOne({
      where: {
        ...(retrieveDTO.id && { id: retrieveDTO.id }),
        ...(retrieveDTO.titulo && { titulo: retrieveDTO.titulo }),
      },
      relations: { artista: true, musicaPlaylists: true },
    });

    if (!musica) {
      throw new NotFoundException('Música não encontrada');
    }

    return musica;
  }

  async update(updateDTO: UpdateMusicaDTO): Promise<Musica> {
    const musica = await this.musicRepository.findOne({
      where: { id: updateDTO.id },
    });

    if (!musica) {
      throw new NotFoundException('Música não encontrada');
    }

    if (updateDTO.titulo !== undefined) {
      musica.titulo = updateDTO.titulo;
    }

    if (updateDTO.duracaoSegundos !== undefined) {
      if (updateDTO.duracaoSegundos <= 0) {
        throw new BadRequestException(
          'A duração da música deve ser maior que zero',
        );
      }
      musica.duracaoSegundos = updateDTO.duracaoSegundos;
    }

    if (updateDTO.artistaId !== undefined) {
      const artistExists = await this.artistRepository.exists({
        where: { id: updateDTO.artistaId },
      });
      if (!artistExists) {
        throw new NotFoundException('Artista não encontrado');
      }
      musica.artistaId = updateDTO.artistaId;
    }

    return await this.musicRepository.save(musica);
  }

  async delete(deleteDTO: DeleteMusicaDTO): Promise<void> {
    const result = await this.musicRepository.delete(deleteDTO.id);

    if (result.affected === 0) {
      throw new NotFoundException('Música não encontrada');
    }
  }
}
