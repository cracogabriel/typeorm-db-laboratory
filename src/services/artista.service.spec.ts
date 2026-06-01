import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artista } from 'src/entities/artista.entity';
import { ArtistaService } from './artista.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ArtistaService', () => {
  let service: ArtistaService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistaService,
        {
          provide: getRepositoryToken(Artista),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArtistaService>(ArtistaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save an artist', async () => {
      const dto = { nome: 'Queen', nacionalidade: 'Britânica' };
      const createdArtist = { id: 1, ...dto, musicas: [] };

      mockRepository.create.mockReturnValue(createdArtist);
      mockRepository.save.mockResolvedValue(createdArtist);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdArtist);
      expect(result).toEqual(createdArtist);
    });
  });

  describe('retrieve', () => {
    it('should throw BadRequestException if both id and nome are missing', async () => {
      await expect(service.retrieve({})).rejects.toThrow(BadRequestException);
    });

    it('should return an artist if found by id', async () => {
      const artist = {
        id: 1,
        nome: 'Queen',
        nacionalidade: 'Britânica',
        musicas: [],
      };
      mockRepository.findOne.mockResolvedValue(artist);

      const result = await service.retrieve({ id: 1 });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { musicas: true },
      });
      expect(result).toEqual(artist);
    });

    it('should throw NotFoundException if artist is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.retrieve({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and save an artist', async () => {
      const artist = {
        id: 1,
        nome: 'Queen',
        nacionalidade: 'Britânica',
        musicas: [],
      };
      mockRepository.findOne.mockResolvedValue(artist);
      mockRepository.save.mockResolvedValue({ ...artist, nome: 'New Queen' });

      const result = await service.update({ id: 1, nome: 'New Queen' });

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(artist.nome).toBe('New Queen');
      expect(mockRepository.save).toHaveBeenCalledWith(artist);
      expect(result.nome).toBe('New Queen');
    });

    it('should throw NotFoundException if artist to update does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update({ id: 999, nome: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should remove artist if artist exists and has no musics', async () => {
      const artist = {
        id: 1,
        nome: 'Queen',
        nacionalidade: 'Britânica',
        musicas: [],
      };
      mockRepository.findOne.mockResolvedValue(artist);
      mockRepository.remove.mockResolvedValue(artist);

      await service.delete({ id: 1 });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { musicas: true },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(artist);
    });

    it('should throw NotFoundException if artist to delete does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete({ id: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if artist has associated musics', async () => {
      const artist = {
        id: 1,
        nome: 'Queen',
        nacionalidade: 'Britânica',
        musicas: [{ id: 1, titulo: 'Bohemian Rhapsody' }],
      };
      mockRepository.findOne.mockResolvedValue(artist);

      await expect(service.delete({ id: 1 })).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
