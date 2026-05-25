import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1779729915000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ARTISTA (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL UNIQUE,
                nacionalidade VARCHAR(100)
            );

            CREATE TABLE USUARIO (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE
            );

            CREATE TABLE PLAYLIST (
                playlist_id SERIAL, 
                usuario_id INTEGER NOT NULL,
                nome VARCHAR(255) NOT NULL,
                data_criacao TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (playlist_id, usuario_id),
                CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES USUARIO (id) ON DELETE CASCADE
            );

            CREATE TABLE MUSICA (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                duracao_segundos INTEGER NOT NULL CHECK (duracao_segundos > 0),
                artista_id INTEGER NOT NULL,
                CONSTRAINT fk_artista FOREIGN KEY (artista_id) REFERENCES ARTISTA (id) ON DELETE RESTRICT
            );

            CREATE TABLE MUSICA_PLAYLIST (
                musica_id INTEGER NOT NULL,
                playlist_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                ordem_na_playlist INTEGER NOT NULL,
                CONSTRAINT fk_musica FOREIGN KEY (musica_id) REFERENCES MUSICA (id) ON DELETE CASCADE,
                CONSTRAINT fk_playlist_composta FOREIGN KEY (playlist_id, usuario_id) REFERENCES PLAYLIST (playlist_id, usuario_id) ON DELETE CASCADE,
                PRIMARY KEY (musica_id, playlist_id, usuario_id),
                UNIQUE (playlist_id, usuario_id, ordem_na_playlist)
            );

            INSERT INTO ARTISTA (nome, nacionalidade) VALUES
            ('Queen', 'Britânica'), ('Led Zeppelin', 'Britânica'), 
            ('AC/DC', 'Australiana'), ('Banda X (Pop)', 'Brasileira');

            INSERT INTO USUARIO (username, email) VALUES
            ('Pablo', 'pablo@aluno.com'), ('Josue', 'josue@aluno.com'), 
            ('Alexandre', 'alexandre@aluno.com');

            INSERT INTO MUSICA (titulo, duracao_segundos, artista_id) VALUES
            ('Bohemian Rhapsody', 354, 1), ('Stairway to Heaven', 482, 2), 
            ('Back In Black', 255, 3), ('We Will Rock You', 160, 1), 
            ('Musica Pop Brasileira', 180, 4), ('Thunderstruck', 292, 3);

            INSERT INTO PLAYLIST (playlist_id, usuario_id, nome) VALUES
            (1, 1, 'Rock do Pablo'), (2, 2,'Baladas do Josue'), (3, 1, 'Heavy Riffs');

            INSERT INTO MUSICA_PLAYLIST (musica_id, playlist_id, usuario_id, ordem_na_playlist) VALUES
            (1, 1, 1, 1), (3, 1, 1, 2), (4, 1, 1, 3),
            (2, 2, 2, 1),
            (3, 3, 1, 1), (6, 3, 1, 2);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE MUSICA_PLAYLIST;
            DROP TABLE MUSICA;
            DROP TABLE PLAYLIST;
            DROP TABLE USUARIO;
            DROP TABLE ARTISTA;
        `);
  }
}
