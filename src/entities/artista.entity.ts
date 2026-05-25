import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Musica } from './musica.entity';

@Entity({ name: 'artista' })
export class Artista {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  nome: string;

  @Column({
    name: 'nacionalidade',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nacionalidade: string;

  // Relacionamento 1:N com Musica
  @OneToMany(() => Musica, (musica) => musica.artista)
  musicas: Musica[];
}
