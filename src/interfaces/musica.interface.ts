export interface CreateMusicaDTO {
  titulo: string;
  duracaoSegundos: number;
  artistaId: number;
}

export interface RetrieveMusicaDTO {
  id?: number;
  titulo?: string;
}

export interface UpdateMusicaDTO {
  id: number;
  titulo?: string;
  duracaoSegundos?: number;
  artistaId?: number;
}

export interface DeleteMusicaDTO {
  id: number;
}
