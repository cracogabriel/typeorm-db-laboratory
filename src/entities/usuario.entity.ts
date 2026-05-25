import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  // Relacionamento 1:N com Playlist
  @OneToMany(() => Playlist, (playlist) => playlist.usuario)
  playlists: Playlist[];
}
