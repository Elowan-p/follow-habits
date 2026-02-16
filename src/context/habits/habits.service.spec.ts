import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import { HabitsRepositoryInterface } from './habits.repository.interface';
import { HabitsError } from './error/habits.error';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';

describe('HabitsService', () => {
  let service: HabitsService;
  let repository: HabitsRepositoryInterface;

  const mockHabitsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        { provide: HabitsRepositoryInterface, useValue: mockHabitsRepository },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const dto: CreateHabitDTO = { name: 'Run', description: 'Run 5km' };
      const habit = { id: '1', ...dto, user: { id: 'uuid' } };
      mockHabitsRepository.create.mockResolvedValue(habit);

      const result = await service.create(dto, 'uuid');

      expect(result).toEqual(habit);
      expect(mockHabitsRepository.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a habit if found', async () => {
      const habit = { id: '1', name: 'Run' };
      mockHabitsRepository.findOne.mockResolvedValue(habit);

      const result = await service.findOne('1');

      expect(result).toEqual(habit);
    });

    it('should throw HabitsError if not found', async () => {
      mockHabitsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(HabitsError);
    });
  });

  describe('update', () => {
    it('should update a habit if found', async () => {
      const habit = { id: '1', name: 'Run' };
      const dto: UpdateHabitDTO = { name: 'Walk' };
      const updatedHabit = { ...habit, ...dto };
      mockHabitsRepository.findOne.mockResolvedValue(habit);
      mockHabitsRepository.update.mockResolvedValue(updatedHabit);

      const result = await service.update('1', dto);

      expect(result).toEqual(updatedHabit);
    });

    it('should throw HabitsError if habit to update is not found', async () => {
      mockHabitsRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Walk' })).rejects.toThrow(
        HabitsError,
      );
    });
  });

  describe('remove', () => {
    it('should remove a habit if found', async () => {
      const habit = { id: '1', name: 'Run' };
      mockHabitsRepository.findOne.mockResolvedValue(habit);
      mockHabitsRepository.remove.mockResolvedValue(undefined); // remove returns void usually, or the entity?

      const result = await service.remove('1');
      // Check implementation of verify: returns the habit
      expect(result).toEqual(habit);
    });

    it('should throw HabitsError if habit to remove is not found', async () => {
      mockHabitsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(HabitsError);
    });
  });
});
