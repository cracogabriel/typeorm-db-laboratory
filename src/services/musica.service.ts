import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Musica } from 'src/entities/musica.entity';
import {
  CreateMusicaDTO,
  RetrieveMusicaDTO,
  UpdateMusicaDTO,
  DeleteMusicaDTO,
} from 'src/interfaces/musica.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MusicsService {
  constructor(
    @InjectRepository(Musica)
    private readonly musicRepository: Repository<Musica>,
  ) {}

  async create(createDTO: CreateMusicaDTO): Promise<Musica> {
    const entity = this.musicRepository.create({
      titulo: createDTO.titulo,
      duracaoSegundos: createDTO.duracaoSegundos,
      artistaId: createDTO.artistaId,
    });

    return await this.musicRepository.save(entity);
  }

  async retrieve(
    retrieveDTO: RetrieveMusicaDTO,
  ): Promise<Musica> {
    const musica = await this.musicRepository.findOne({
      where: {
        ...(retrieveDTO.id && { id: retrieveDTO.id }),
        ...(retrieveDTO.titulo && { titulo: retrieveDTO.titulo }),
      },
      relations: ['artista', 'musicaPlaylists'],
    });

    if (!musica) {
      throw new NotFoundException('Música não encontrada');
    }

    return musica;
  }

  async update(
    updateDTO: UpdateMusicaDTO,
  ): Promise<Musica> {
    const musica = await this.musicRepository.preload({
      id: updateDTO.id,
      titulo: updateDTO.titulo,
      duracaoSegundos: updateDTO.duracaoSegundos,
      artistaId: updateDTO.artistaId,
    });

    if (!musica) {
      throw new NotFoundException('Música não encontrada');
    }

    return await this.musicRepository.save(musica);
  }

  async delete(
    deleteDTO: DeleteMusicaDTO,
  ): Promise<void> {
    const result = await this.musicRepository.delete(
      deleteDTO.id,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Música não encontrada');
    }
  }
}
