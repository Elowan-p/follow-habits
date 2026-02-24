import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { HabitCategory } from './enums/habit-category.enum';
import { HabitPresenter } from './presenter/habit.presenter';

describe('HabitsController', () => {
  let controller: HabitsController;

  const mockHabitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
    jest.clearAllMocks();
  });

  const mockRequest = (userId: string) => {
    return {
      user: { id: userId },
    };
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call habitsService.create and return a presenter', () => {
      const dto: CreateHabitDTO = { name: 'Test', category: HabitCategory.SPORT };
      mockHabitsService.create.mockReturnValue({ id: 'h1', ...dto });

      const result = controller.create(dto, mockRequest('user-1'));
      
      expect(mockHabitsService.create).toHaveBeenCalledWith(dto, 'user-1');
      expect(result).toBeInstanceOf(HabitPresenter);
      expect(result.id).toBe('h1');
    });
  });

  describe('findAll', () => {
    it('should call habitsService.findAll and return an array of presenters', () => {
      mockHabitsService.findAll.mockReturnValue([
        { id: 'h1', name: 'Test' }
      ]);

      const result = controller.findAll();
      
      expect(mockHabitsService.findAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(HabitPresenter);
    });
  });

  describe('findOne', () => {
    it('should call habitsService.findOne', () => {
      mockHabitsService.findOne.mockReturnValue({ id: 'h1', name: 'Test' });

      const result = controller.findOne('h1');
      
      expect(mockHabitsService.findOne).toHaveBeenCalledWith('h1');
      expect(result.id).toBe('h1');
    });
  });

  describe('update', () => {
    it('should call habitsService.update', () => {
      const dto: UpdateHabitDTO = { name: 'Updated' };
      mockHabitsService.update.mockReturnValue({ id: 'h1', name: 'Updated' });

      const result = controller.update('h1', dto);
      
      expect(mockHabitsService.update).toHaveBeenCalledWith('h1', dto);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should call habitsService.remove', () => {
      mockHabitsService.remove.mockReturnValue({ id: 'h1' });

      const result = controller.remove('h1');
      
      expect(mockHabitsService.remove).toHaveBeenCalledWith('h1');
      expect(result.id).toBe('h1');
    });
  });
});
