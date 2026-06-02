import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artista } from 'src/entities/artista.entity';
import { Musica } from 'src/entities/musica.entity';
import { MusicaService } from './musica.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MusicaService', () => {
  let service: MusicaService;

  const mockMusicRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockArtistRepository = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicaService,
        {
          provide: getRepositoryToken(Musica),
          useValue: mockMusicRepository,
        },
        {
          provide: getRepositoryToken(Artista),
          useValue: mockArtistRepository,
        },
      ],
    }).compile();

    service = module.get<MusicaService>(MusicaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if duration <= 0', async () => {
      const dto = { titulo: 'Song', duracaoSegundos: 0, artistaId: 1 };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if artist does not exist', async () => {
      const dto = { titulo: 'Song', duracaoSegundos: 120, artistaId: 999 };
      mockArtistRepository.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(mockArtistRepository.exists).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should create and save a music if artist exists and duration is valid', async () => {
      const dto = {
        titulo: 'Bohemian Rhapsody',
        duracaoSegundos: 354,
        artistaId: 1,
      };
      const savedMusic = { id: 1, ...dto };

      mockArtistRepository.exists.mockResolvedValue(true);
      mockMusicRepository.create.mockReturnValue(savedMusic);
      mockMusicRepository.save.mockResolvedValue(savedMusic);

      const result = await service.create(dto);

      expect(mockArtistRepository.exists).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockMusicRepository.create).toHaveBeenCalledWith(dto);
      expect(mockMusicRepository.save).toHaveBeenCalledWith(savedMusic);
      expect(result).toEqual(savedMusic);
    });
  });

  describe('retrieve', () => {
    it('should throw BadRequestException if both id and titulo are missing', async () => {
      await expect(service.retrieve({})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if both id and titulo are provided', async () => {
      await expect(service.retrieve({ id: 1, titulo: 'Song' })).rejects.toThrow(BadRequestException);
    });

    it('should return a music if found by id', async () => {
      const music = {
        id: 1,
        titulo: 'Song',
        duracaoSegundos: 180,
        artistaId: 1,
      };
      mockMusicRepository.findOne.mockResolvedValue(music);

      const result = await service.retrieve({ id: 1 });

      expect(mockMusicRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { artista: true, musicaPlaylists: true },
      });
      expect(result).toEqual(music);
    });

    it('should throw NotFoundException if music is not found', async () => {
      mockMusicRepository.findOne.mockResolvedValue(null);

      await expect(service.retrieve({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if music to update does not exist', async () => {
      mockMusicRepository.findOne.mockResolvedValue(null);

      await expect(service.update({ id: 999, titulo: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and save music with updated details', async () => {
      const music = {
        id: 1,
        titulo: 'Song',
        duracaoSegundos: 180,
        artistaId: 1,
      };
      mockMusicRepository.findOne.mockResolvedValue(music);
      mockArtistRepository.exists.mockResolvedValue(true);
      mockMusicRepository.save.mockImplementation((entity: unknown) =>
        Promise.resolve(entity as Musica),
      );

      const result = await service.update({
        id: 1,
        titulo: 'New Song',
        duracaoSegundos: 200,
        artistaId: 2,
      });

      expect(mockMusicRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockArtistRepository.exists).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(music.titulo).toBe('New Song');
      expect(music.duracaoSegundos).toBe(200);
      expect(music.artistaId).toBe(2);
      expect(mockMusicRepository.save).toHaveBeenCalledWith(music);
      expect(result).toEqual(music);
    });

    it('should throw BadRequestException if updated duration is <= 0', async () => {
      const music = {
        id: 1,
        titulo: 'Song',
        duracaoSegundos: 180,
        artistaId: 1,
      };
      mockMusicRepository.findOne.mockResolvedValue(music);

      await expect(
        service.update({ id: 1, duracaoSegundos: -10 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if updated artist does not exist', async () => {
      const music = {
        id: 1,
        titulo: 'Song',
        duracaoSegundos: 180,
        artistaId: 1,
      };
      mockMusicRepository.findOne.mockResolvedValue(music);
      mockArtistRepository.exists.mockResolvedValue(false);

      await expect(service.update({ id: 1, artistaId: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete music if it exists', async () => {
      mockMusicRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete({ id: 1 });

      expect(mockMusicRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if music to delete does not exist', async () => {
      mockMusicRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete({ id: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
