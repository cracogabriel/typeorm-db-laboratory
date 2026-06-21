import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './data-source';

import { Artista } from './entities/artista.entity';
import { Musica } from './entities/musica.entity';
import { Playlist } from './entities/playlist.entity';
import { Usuario } from './entities/usuario.entity';
import { MusicaPlaylist } from './entities/musica-playlist.entity';

import { ArtistaService } from './services/artista.service';
import { MusicaService } from './services/musica.service';
import { PlaylistService } from './services/playlist.service';
import { AdvancedQueriesService } from './services/advancedQueries.service';

import { ArtistaController } from './controllers/artista.controller';
import { MusicaController } from './controllers/musica.controller';
import { PlaylistController } from './controllers/playlist.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([
      Artista,
      Musica,
      Playlist,
      MusicaPlaylist,
      Usuario,
    ]),
  ],
  controllers: [
    AppController,
    ArtistaController,
    MusicaController,
    PlaylistController,
  ],
  providers: [AppService, ArtistaService, MusicaService, PlaylistService, AdvancedQueriesService],
})
export class AppModule {}
