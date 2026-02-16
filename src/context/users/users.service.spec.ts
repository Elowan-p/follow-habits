import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UsersError } from './error/users.error';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepositoryInterface;

  const mockUsersRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepositoryInterface, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', name: 'Test User' };
      mockUsersRepository.findOneById.mockResolvedValue(user);

      const result = await service.findOne({ id: '1' });

      expect(result.data).toEqual(user);
    });

    it('should throw UsersError if not found', async () => {
      mockUsersRepository.findOneById.mockResolvedValue(null);

      await expect(service.findOne({ id: '1' })).rejects.toThrow(UsersError);
    });
  });

  describe('update', () => {
    it('should update a user if found', async () => {
      const user = { id: '1', name: 'Old Name' };
      const updatedUser = { id: '1', name: 'New Name' };
      mockUsersRepository.findOneById.mockResolvedValue(user);
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', { name: 'New Name' });

      expect(result.data).toEqual(updatedUser);
    });

    it('should throw UsersError if user to update is not found', async () => {
      mockUsersRepository.findOneById.mockResolvedValue(null);

      await expect(service.update('1', { name: 'New Name' })).rejects.toThrow(
        UsersError,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      const user = { id: '1', name: 'User' };
      mockUsersRepository.findOneById.mockResolvedValue(user);
      mockUsersRepository.remove.mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(result.data).toEqual(user);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw UsersError if user to remove is not found', async () => {
      mockUsersRepository.findOneById.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(UsersError);
    });
  });
});
