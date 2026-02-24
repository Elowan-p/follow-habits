import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { HabitsRepositoryInterface } from '../habits/habits.repository.interface';
import { TrackingRepositoryInterface } from '../tracking/tracking.repository.interface';
import { HabitCategory } from '../habits/enums/habit-category.enum';

describe('StatsService', () => {
  let service: StatsService;
  let habitsRepository: jest.Mocked<HabitsRepositoryInterface>;
  let trackingRepository: jest.Mocked<TrackingRepositoryInterface>;

  beforeEach(async () => {
    const mockHabitsRepository = {
      findAll: jest.fn(),
    };

    const mockTrackingRepository = {
      getStats: jest.fn(),
      getTrackingDatesForStreak: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: HabitsRepositoryInterface,
          useValue: mockHabitsRepository,
        },
        {
          provide: TrackingRepositoryInterface,
          useValue: mockTrackingRepository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    habitsRepository = module.get(HabitsRepositoryInterface);
    trackingRepository = module.get(TrackingRepositoryInterface);
  });

  describe('getGlobalStats', () => {
    it('should return computed stats with 0% completion rate when no trackings exist', async () => {
      habitsRepository.findAll.mockResolvedValue([{} as any, {} as any]);
      trackingRepository.getStats.mockResolvedValue({
        totalTrackings: 0,
        completedTrackings: 0,
      });
      trackingRepository.getTrackingDatesForStreak.mockResolvedValue([]);

      const result = await service.getGlobalStats();

      expect(habitsRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(trackingRepository.getStats).toHaveBeenCalledWith({
        userId: undefined,
        category: undefined,
      });
      expect(trackingRepository.getTrackingDatesForStreak).toHaveBeenCalledWith(
        { userId: undefined, category: undefined },
      );

      expect(result).toEqual({
        userId: undefined,
        totalHabits: 2,
        category: 'ALL',
        completedTrackings: 0,
        totalTrackings: 0,
        completionRate: '0%',
        longestStreak: 0,
      });
    });

    it('should calculate the correct completion rate', async () => {
      habitsRepository.findAll.mockResolvedValue([{} as any, {} as any]);
      trackingRepository.getStats.mockResolvedValue({
        totalTrackings: 10,
        completedTrackings: 8,
      });
      trackingRepository.getTrackingDatesForStreak.mockResolvedValue([]);

      const result = await service.getGlobalStats();

      expect(result.completionRate).toBe('80%');
      expect(result.completedTrackings).toBe(8);
      expect(result.totalTrackings).toBe(10);
    });

    it('should calculate the longest streak correctly based on dates', async () => {
      habitsRepository.findAll.mockResolvedValue([]);
      trackingRepository.getStats.mockResolvedValue({
        totalTrackings: 3,
        completedTrackings: 3,
      });

      const dates = [
        new Date('2026-02-24T10:00:00Z'),
        new Date('2026-02-23T10:00:00Z'),
        new Date('2026-02-22T10:00:00Z'),

        new Date('2026-02-20T10:00:00Z'),
        new Date('2026-02-19T10:00:00Z'),
      ];
      trackingRepository.getTrackingDatesForStreak.mockResolvedValue(dates);

      const result = await service.getGlobalStats();

      expect(result.longestStreak).toBe(3);
    });

    it('should filter by user and category', async () => {
      habitsRepository.findAll.mockResolvedValue([]);
      trackingRepository.getStats.mockResolvedValue({
        totalTrackings: 0,
        completedTrackings: 0,
      });
      trackingRepository.getTrackingDatesForStreak.mockResolvedValue([]);

      await service.getGlobalStats(HabitCategory.HEALTH, 'user-123');

      expect(habitsRepository.findAll).toHaveBeenCalledWith(
        HabitCategory.HEALTH,
        'user-123',
      );
      expect(trackingRepository.getStats).toHaveBeenCalledWith({
        userId: 'user-123',
        category: HabitCategory.HEALTH,
      });
    });
  });

  describe('getUserStats', () => {
    it('should call getGlobalStats with the category and userId', async () => {
      jest
        .spyOn(service, 'getGlobalStats')
        .mockResolvedValue('mockedResult' as any);

      const result = await service.getUserStats(
        'user-123',
        HabitCategory.SPORT,
      );

      expect(service.getGlobalStats).toHaveBeenCalledWith(
        HabitCategory.SPORT,
        'user-123',
      );
      expect(result).toBe('mockedResult');
    });
  });
});
