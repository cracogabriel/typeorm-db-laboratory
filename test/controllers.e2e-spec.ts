import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Controllers (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ArtistaController (e2e)', () => {
    let createdArtistId: number;

    it('GET /artistas (retrieve by name)', async () => {
      const response = await request(app.getHttpServer())
        .get('/artistas')
        .query({ nome: 'Queen' })
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('nome', 'Queen');
    });

    it('GET /artistas (retrieve by id)', async () => {
      const response = await request(app.getHttpServer())
        .get('/artistas')
        .query({ id: 2 })
        .expect(200);

      expect(response.body).toHaveProperty('id', 2);
      expect(response.body).toHaveProperty('nome', 'Led Zeppelin');
    });

    it('GET /artistas (retrieve failure - missing params)', async () => {
      await request(app.getHttpServer()).get('/artistas').expect(400);
    });

    it('POST /artistas (create) & PUT /artistas/:id (update) & DELETE /artistas/:id (delete)', async () => {
      // 1. Create
      const createResponse = await request(app.getHttpServer())
        .post('/artistas')
        .send({ nome: 'The Beatles', nacionalidade: 'Britânica' })
        .expect(201);

      createdArtistId = (createResponse.body as { id: number }).id;
      expect(createdArtistId).toBeDefined();

      // 2. Update
      const updateResponse = await request(app.getHttpServer())
        .put(`/artistas/${createdArtistId}`)
        .send({ nome: 'The Beatles Remastered' })
        .expect(200);

      expect((updateResponse.body as { nome: string }).nome).toBe(
        'The Beatles Remastered',
      );

      // 3. Delete
      await request(app.getHttpServer())
        .delete(`/artistas/${createdArtistId}`)
        .expect(204);

      // Verify deleted
      await request(app.getHttpServer())
        .get('/artistas')
        .query({ id: createdArtistId })
        .expect(404);
    });

    it('DELETE /artistas/:id (failure - artist with music)', async () => {
      // Artist ID 1 (Queen) has music ID 1 (Bohemian Rhapsody)
      await request(app.getHttpServer()).delete('/artistas/1').expect(400);
    });
  });

  describe('MusicaController (e2e)', () => {
    let createdMusicId: number;

    it('GET /musicas (retrieve by title)', async () => {
      const response = await request(app.getHttpServer())
        .get('/musicas')
        .query({ titulo: 'Bohemian Rhapsody' })
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('titulo', 'Bohemian Rhapsody');
    });

    it('GET /musicas (retrieve by id)', async () => {
      const response = await request(app.getHttpServer())
        .get('/musicas')
        .query({ id: 2 })
        .expect(200);

      expect(response.body).toHaveProperty('id', 2);
      expect(response.body).toHaveProperty('titulo', 'Stairway to Heaven');
    });

    it('POST /musicas (create success) & PUT /musicas/:id (update success) & DELETE /musicas/:id', async () => {
      // 1. Create
      const createResponse = await request(app.getHttpServer())
        .post('/musicas')
        .send({ titulo: 'Yesterday', duracaoSegundos: 125, artistaId: 2 }) // LED ZEPPELIN
        .expect(201);

      createdMusicId = (createResponse.body as { id: number }).id;
      expect(createdMusicId).toBeDefined();

      // 2. Update
      const updateResponse = await request(app.getHttpServer())
        .put(`/musicas/${createdMusicId}`)
        .send({ titulo: 'Yesterday - Remastered', duracaoSegundos: 130 })
        .expect(200);

      expect((updateResponse.body as { titulo: string }).titulo).toBe(
        'Yesterday - Remastered',
      );
      expect(
        (updateResponse.body as { duracaoSegundos: number }).duracaoSegundos,
      ).toBe(130);

      // 3. Delete
      await request(app.getHttpServer())
        .delete(`/musicas/${createdMusicId}`)
        .expect(204);

      // Verify deleted
      await request(app.getHttpServer())
        .get('/musicas')
        .query({ id: createdMusicId })
        .expect(404);
    });

    it('POST /musicas (create failure - invalid duration)', async () => {
      await request(app.getHttpServer())
        .post('/musicas')
        .send({ titulo: 'Fail Song', duracaoSegundos: -10, artistaId: 1 })
        .expect(400);
    });

    it('POST /musicas (create failure - non-existent artist)', async () => {
      await request(app.getHttpServer())
        .post('/musicas')
        .send({ titulo: 'Fail Song', duracaoSegundos: 100, artistaId: 999 })
        .expect(404);
    });
  });

  describe('PlaylistController (e2e)', () => {
    let createdPlaylistId: number;

    it('POST /playlists (create success) & POST/DELETE musicas (add/remove)', async () => {
      // 1. Create Playlist for user 3
      const createResponse = await request(app.getHttpServer())
        .post('/playlists')
        .send({ id_usuario: 3, nome_playlist: 'Minha Playlist E2E' })
        .expect(201);

      createdPlaylistId = (createResponse.body as { playlistId: number })
        .playlistId;
      expect(createdPlaylistId).toBeDefined();

      // 2. Add music 1 (Bohemian Rhapsody) to playlist
      const addResponse = await request(app.getHttpServer())
        .post(`/playlists/${createdPlaylistId}/musicas/1`)
        .expect(201);

      expect(addResponse.body).toHaveProperty('playlistId', createdPlaylistId);
      expect(addResponse.body).toHaveProperty('musicaId', 1);

      // 3. Remove music 1 from playlist
      await request(app.getHttpServer())
        .delete(`/playlists/${createdPlaylistId}/musicas/1`)
        .expect(204);
    });

    it('POST /playlists (create failure - non-existent user)', async () => {
      await request(app.getHttpServer())
        .post('/playlists')
        .send({ id_usuario: 999, nome_playlist: 'Fail Playlist' })
        .expect(500); // throws generic Error ('Usuário não encontrado') which Nest maps to 500
    });
  });
});
