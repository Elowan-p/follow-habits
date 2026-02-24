import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { HabitCategory } from '../habits/enums/habit-category.enum';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { GetUserStatsDto } from './dto/get-user-stats.dto';
import { GetGlobalStatsDto } from './dto/get-global-stats.dto';
import { StatsPresenter } from './presenter/stats.presenter';
import { Request } from 'express';

describe('StatsController', () => {
  let controller: StatsController;
  let statsService: jest.Mocked<StatsService>;

  beforeEach(async () => {
    const mockStatsService = {
      getGlobalStats: jest.fn(),
      getUserStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: mockStatsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RightsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StatsController>(StatsController);
    statsService = module.get(StatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserStats', () => {
    it('should return user stats mapping through StatsPresenter', async () => {
      const mockReq: Partial<Request> = {
        user: { sub: 'user-123' },
      };
      const query: GetUserStatsDto = { category: HabitCategory.HEALTH };

      const mockServiceResult = {
        userId: 'user-123',
        totalHabits: 5,
        category: HabitCategory.HEALTH,
        completedTrackings: 10,
        totalTrackings: 15,
        completionRate: '66%',
        longestStreak: 5,
      };

      statsService.getUserStats.mockResolvedValue(mockServiceResult);

      const result = await controller.getUserStats(mockReq as Request, query);

      expect(statsService.getUserStats).toHaveBeenCalledWith(
        'user-123',
        HabitCategory.HEALTH,
      );
      expect(result).toBeInstanceOf(StatsPresenter);
      expect(result.totalHabits).toBe(5);
      expect(result.completionRate).toBe('66%');
    });
  });

  describe('getGlobalStats', () => {
    it('should return global stats mapping through StatsPresenter', async () => {
      const query: GetGlobalStatsDto = {
        category: HabitCategory.SPORT,
        userId: 'user-456',
      };

      const mockServiceResult = {
        userId: 'user-456',
        totalHabits: 2,
        category: HabitCategory.SPORT,
        completedTrackings: 5,
        totalTrackings: 5,
        completionRate: '100%',
        longestStreak: 3,
      };

      statsService.getGlobalStats.mockResolvedValue(mockServiceResult);

      const result = await controller.getGlobalStats(query);

      expect(statsService.getGlobalStats).toHaveBeenCalledWith(
        HabitCategory.SPORT,
        'user-456',
      );
      expect(result).toBeInstanceOf(StatsPresenter);
      expect(result.totalHabits).toBe(2);
      expect(result.completionRate).toBe('100%');
    });
  });
});
