export interface CreatePlaylistDTO {
  id_usuario: number;
  nome_playlist: string;
}

export interface AddMusicToPlaylistDTO {
  playlistId: number;
  musicId: number;
}

export interface RemoveMusicFromPlaylistDTO {
  playlistId: number;
  musicId: number;
}
