import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Artista } from './artista.entity';
import { MusicaPlaylist } from './musica-playlist.entity';

@Entity({ name: 'musica' })
@Check(`"duracao_segundos" > 0`) // Garante a restrição CHECK do banco
export class Musica {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'titulo', type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ name: 'duracao_segundos', type: 'integer', nullable: false })
  duracaoSegundos: number;

  @Column({ name: 'artista_id', type: 'integer', nullable: false })
  artistaId: number;

  // Relacionamento N:1 com Artista (ON DELETE RESTRICT)
  @ManyToOne(() => Artista, (artista) => artista.musicas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'artista_id' })
  artista: Artista;

  // Relacionamento com a tabela pivô do N:N
  @OneToMany(() => MusicaPlaylist, (musicaPlaylist) => musicaPlaylist.musica)
  musicaPlaylists: MusicaPlaylist[];
}
