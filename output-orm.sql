-- 2.1.1 Playlists de um Usuário Específico
-- Listar todas as Playlists de um usuário específico, usando o username como filtro.
SELECT "playlist"."nome" AS nome, "playlist"."data_criacao" AS dataCriacao FROM "playlist" "playlist" INNER JOIN "usuario" "usuario" ON "usuario"."id"="playlist"."usuario_id" WHERE "usuario"."username" = $1 ORDER BY "playlist"."data_criacao" ASC -- PARAMETERS: ["Ben"];

-- 2.1.2 Músicas em Playlists de um Artista
-- Encontrar todas as Músicas que pertencem a qualquer Playlist criada por um usuário específico, cujo artista seja o informado.
SELECT "musica"."titulo" AS musicaNome, "playlist"."nome" AS playlistNome FROM "playlist" "playlist" INNER JOIN "usuario" "usuario" ON "usuario"."id"="playlist"."usuario_id"  INNER JOIN "musica_playlist" "mp" ON "mp"."playlist_id"="playlist"."playlist_id" AND "mp"."usuario_id"="playlist"."usuario_id"  INNER JOIN "musica" "musica" ON "musica"."id"="mp"."musica_id"  INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "usuario"."username" = $1 AND "artista"."nome" = $2 -- PARAMETERS: ["Ben","The Beatles"];

-- 2.1.3 Contagem de Músicas por Playlist
-- Listar o nome de todas as Playlists e o número total de Músicas que cada uma contém, ordenado da mais longa para a mais curta.
SELECT "playlist"."nome" AS "playlistNome", COUNT("musica"."id") AS "totalMusicas" FROM "playlist" "playlist" INNER JOIN "musica_playlist" "mp" ON "mp"."playlist_id"="playlist"."playlist_id" AND "mp"."usuario_id"="playlist"."usuario_id"  INNER JOIN "musica" "musica" ON "musica"."id"="mp"."musica_id" GROUP BY "playlist"."nome" ORDER BY "totalMusicas" DESC;

-- 2.1.4 Artistas Sem Músicas em Playlists
-- Listar todos os Artistas que não possuem nenhuma de suas Músicas adicionadas a nenhuma Playlist.
SELECT "artista"."nome" AS "nome" FROM "artista" "artista" WHERE NOT EXISTS (SELECT 1 FROM "musica" "musica" INNER JOIN "artista" "a2" ON "a2"."id"="musica"."artista_id"  INNER JOIN "musica_playlist" "mp" ON "mp"."musica_id"="musica"."id" WHERE "a2"."id" = "artista"."id");

-- 2.2 Detalhes Completos da Música com Artista (Eager Loading / Fetching Join)
-- Buscar uma Música por seu id e carregar automaticamente todos os detalhes do Artista relacionado em uma única consulta.
SELECT "musica"."id" AS musica_id, "musica"."titulo" AS musica_titulo, "musica"."duracao_segundos" AS "musica_duracaoSegundos", "artista"."id" AS artista_id, "artista"."nome" AS artista_nome, "artista"."nacionalidade" AS artista_nacionalidade FROM "musica" "musica" INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "musica"."id" = $1 -- PARAMETERS: [1];

-- 2.2 Tempo Total de Reprodução da Playlist (Agregação SUM e GROUP BY sobre N:N)
-- Para cada Playlist, calcular o tempo total de reprodução (soma de duracao_segundos de todas as músicas).
SELECT "playlist"."nome" AS playlist_nome, "usuario"."username" AS dono_username, COALESCE(SUM("musica"."duracao_segundos"), 0) AS tempo_total_segundos FROM "playlist" "playlist" INNER JOIN "usuario" "usuario" ON "usuario"."id"="playlist"."usuario_id"  LEFT JOIN "musica_playlist" "mp" ON "mp"."playlist_id"="playlist"."playlist_id" AND "mp"."usuario_id"="playlist"."usuario_id"  LEFT JOIN "musica" "musica" ON "musica"."id"="mp"."musica_id" GROUP BY "playlist"."playlist_id", "playlist"."nome", "usuario"."username";

-- 2.2 Músicas Mais Curtas que a Média do Artista (Subconsulta)
-- Listar todas as Músicas cuja duração é menor que a duração média de todas as músicas do seu próprio Artista.
SELECT "musica"."id" AS musica_id, "musica"."titulo" AS musica_titulo, "musica"."duracao_segundos" AS duracao_segundos, "artista"."nome" AS artista_nome FROM "musica" "musica" INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "musica"."duracao_segundos" < ((SELECT AVG("m2"."duracao_segundos") FROM "musica" "m2" WHERE "m2"."artista_id" = "musica"."artista_id")) ORDER BY "artista"."nome" ASC, "musica"."duracao_segundos" ASC;

-- 2.4 Rank de Popularidade do Artista (Window Function / Ranking)
-- Listar todos os Artistas e seu ranking baseado no número de Playlists em que suas músicas estão presentes.
SELECT "artista"."id" AS artista_id, "artista"."nome" AS artista_nome, COUNT(DISTINCT "mp"."playlist_id") AS total_playlists, RANK() OVER (ORDER BY COUNT(DISTINCT "mp"."playlist_id") DESC) AS rank FROM "artista" "artista" LEFT JOIN "musica" "musica" ON "musica"."artista_id"="artista"."id"  LEFT JOIN "musica_playlist" "mp" ON "mp"."musica_id"="musica"."id" GROUP BY "artista"."id", "artista"."nome" ORDER BY rank ASC;

-- 2.4 Comparação com o Top 1 (Subconsulta Correlacionada)
-- Listar todas as Músicas de um Artista cuja duração é maior que a duração da música mais longa de outro Artista.
SELECT "musica"."id" AS musica_id, "musica"."titulo" AS musica_titulo, "musica"."duracao_segundos" AS duracao_segundos, "artista"."nome" AS artista_nome FROM "musica" "musica" INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "artista"."nome" = $1 AND "musica"."duracao_segundos" > ((SELECT MAX("m2"."duracao_segundos") FROM "musica" "m2" INNER JOIN "artista" "a2" ON "a2"."id"="m2"."artista_id" WHERE "a2"."nome" = $2)) ORDER BY "musica"."duracao_segundos" DESC -- PARAMETERS: ["Led Zeppelin","Queen"];

-- 2.3.8 Busca em Tabela de Junção com Atributos Extras
-- Listar o título de todas as Músicas na playlist 'Rock do Pablo', incluindo a ordem_na_playlist de cada música.
SELECT "musica"."titulo" AS musicaNome, "mp"."ordem_na_playlist" AS musicaPlaylistOrdem FROM "playlist" "playlist" INNER JOIN "musica_playlist" "mp" ON "mp"."playlist_id"="playlist"."playlist_id" AND "mp"."usuario_id"="playlist"."usuario_id"  INNER JOIN "musica" "musica" ON "musica"."id"="mp"."musica_id"  INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "playlist"."nome" = $1 -- PARAMETERS: ["Rock do Pablo"];

-- 2.3.9 Busca por Chave Composta Invertida
-- Encontrar o username do Usuário dono da Playlist que contém a música 'Bohemian Rhapsody'.
SELECT DISTINCT "usuario"."username" AS usuarioNome FROM "playlist" "playlist" INNER JOIN "usuario" "usuario" ON "usuario"."id"="playlist"."usuario_id"  INNER JOIN "musica_playlist" "mp" ON "mp"."playlist_id"="playlist"."playlist_id" AND "mp"."usuario_id"="playlist"."usuario_id"  INNER JOIN "musica" "musica" ON "musica"."id"="mp"."musica_id"  INNER JOIN "artista" "artista" ON "artista"."id"="musica"."artista_id" WHERE "musica"."titulo" = $1 -- PARAMETERS: ["Bohemian Rhapsody"];

-- 2.5.12 Transferência Transacional de Música (Transferência Atômica)
-- Mover uma Música de uma Playlist para outra do mesmo Usuário, garantindo atomicidade via transação.
START TRANSACTION;
SELECT "Playlist"."playlist_id" AS "Playlist_playlist_id", "Playlist"."usuario_id" AS "Playlist_usuario_id", "Playlist"."nome" AS "Playlist_nome", "Playlist"."data_criacao" AS "Playlist_data_criacao" FROM "playlist" "Playlist" WHERE (("Playlist"."playlist_id" = $1)) LIMIT 1 -- PARAMETERS: [1];
SELECT "Playlist"."playlist_id" AS "Playlist_playlist_id", "Playlist"."usuario_id" AS "Playlist_usuario_id", "Playlist"."nome" AS "Playlist_nome", "Playlist"."data_criacao" AS "Playlist_data_criacao" FROM "playlist" "Playlist" WHERE (("Playlist"."playlist_id" = $1)) LIMIT 1 -- PARAMETERS: [2];
-- (as queries seguintes dependem dos dados encontrados: busca da música, COUNT para ordem, INSERT na playlist destino, DELETE da playlist origem, UPDATE para reordenar)
ROLLBACK;
