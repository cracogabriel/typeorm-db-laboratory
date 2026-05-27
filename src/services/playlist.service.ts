import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { CreatePlaylistDTO } from 'src/interfaces/playlist.interface';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async create(createDTO: CreatePlaylistDTO): Promise<Playlist> {
    const user = await this.playlistRepository.findOne({
      where: { usuarioId: createDTO.id_usuario },
    });

    if (!user) throw new Error('Usuário não encontrado');

    const playlist = this.playlistRepository.create({
      usuarioId: createDTO.id_usuario,
      nome: createDTO.nome_playlist,
    });

    return this.playlistRepository.save(playlist);
  }
}
