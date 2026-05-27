import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { MusicaPlaylist } from './musica-playlist.entity';

@Entity({ name: 'playlist' })
export class Playlist {
  @PrimaryGeneratedColumn({ name: 'playlist_id' })
  playlistId: number;

  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'nome', type: 'varchar', length: 255, nullable: false })
  nome: string;

  // Coluna de data de criação com valor padrão de timestamp atual
  @CreateDateColumn({
    name: 'data_criacao',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCriacao: Date;

  // Relacionamento 1:N com Usuario (ON DELETE CASCADE)
  @ManyToOne(() => Usuario, (usuario) => usuario.playlists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Relacionamento com a tabela pivô do N:N
  @OneToMany(() => MusicaPlaylist, (musicaPlaylist) => musicaPlaylist.playlist)
  musicaPlaylists: MusicaPlaylist[];
}
