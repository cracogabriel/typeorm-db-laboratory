export interface CreateArtistaDTO {
  nome: string;
  nacionalidade: string;
}

export interface UpdateArtistaDTO {
  id: number;
  nome?: string;
  nacionalidade?: string;
}

export interface RetrieveArtistaDTO {
  id?: number;
  nome?: string;
}

export interface DeleteArtistaDTO {
  id: number;
}
