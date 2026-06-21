import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppDataSource } from "../data-source";
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import {
  _1_1_IN_playlistsUsuarioDTO,
  _1_1_OUT_playlistsUsuarioDTO
} from 'src/interfaces/advancedQueries.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AdvancedQueriesService {

  async _1_1_playlistsUsuario(dto_in: _1_1_IN_playlistsUsuarioDTO) {
    return await AppDataSource
      .getRepository(Playlist)
      .createQueryBuilder("playlist")
      .innerJoin("playlist.usuario", "usuario")
      .select([
        "playlist.nome AS nome",
        "playlist.dataCriacao AS dataCriacao"
      ])
      .where("usuario.username = :username", { dto_in.nome })
      .orderBy("playlist.dataCriacao", "ASC")
      .getRawMany<_1_1_OUT_playlistsUsuarioDTO>();
  }
  
}
