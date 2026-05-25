import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Musica } from './musica.entity';
import { Playlist } from './playlist.entity';

@Entity({ name: 'musica_playlist' })
@Unique(['playlistId', 'usuarioId', 'ordemNaPlaylist']) // UNIQUE correspondente ao banco
export class MusicaPlaylist {
  @PrimaryColumn({ name: 'musica_id' })
  musicaId: number;

  @PrimaryColumn({ name: 'playlist_id' })
  playlistId: number;

  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'ordem_na_playlist', type: 'integer', nullable: false })
  ordemNaPlaylist: number;

  // Relacionamento com Musica (ON DELETE CASCADE)
  @ManyToOne(() => Musica, (musica) => musica.musicaPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'musica_id' })
  musica: Musica;

  // Relacionamento com Playlist referenciando a chave composta (ON DELETE CASCADE)
  @ManyToOne(() => Playlist, (playlist) => playlist.musicaPlaylists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'playlist_id', referencedColumnName: 'playlistId' },
    { name: 'usuario_id', referencedColumnName: 'usuarioId' },
  ])
  playlist: Playlist;
}
