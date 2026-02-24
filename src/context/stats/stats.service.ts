import { Injectable } from '@nestjs/common';
import { HabitsRepositoryInterface } from '../habits/habits.repository.interface';
import { TrackingRepositoryInterface } from '../tracking/tracking.repository.interface';

@Injectable()
export class StatsService {
  constructor(
    private readonly habitsRepository: HabitsRepositoryInterface,
    private readonly trackingRepository: TrackingRepositoryInterface,
  ) {}

  async getUserStats(userId: string, category?: string) {
    return this.getGlobalStats(category, userId);
  }

  async getGlobalStats(category?: string, userId?: string) {
    const habits = await this.habitsRepository.findAll(category, userId);

    const { totalTrackings, completedTrackings } =
      await this.trackingRepository.getStats({ userId, category });

    const completionRate =
      totalTrackings > 0
        ? Math.round((completedTrackings / totalTrackings) * 100) + '%'
        : '0%';

    const trackingDates =
      await this.trackingRepository.getTrackingDatesForStreak({
        userId,
        category,
      });
    const longestStreak = this.calculateLongestStreak(trackingDates);

    return {
      userId: userId || undefined,
      totalHabits: habits.length,
      category: category || 'ALL',
      completedTrackings,
      totalTrackings,
      completionRate,
      longestStreak,
    };
  }

  private calculateLongestStreak(dates: Date[]): number {
    if (!dates || dates.length === 0) return 0;

    dates.sort((a, b) => b.getTime() - a.getTime());

    let maxStreak = 1;
    let currentStreak = 1;

    const uniqueDays: string[] = [];
    for (const date of dates) {
      const dayString = date.toISOString().split('T')[0];
      if (
        uniqueDays.length === 0 ||
        uniqueDays[uniqueDays.length - 1] !== dayString
      ) {
        uniqueDays.push(dayString);
      }
    }

    if (uniqueDays.length === 0) return 0;

    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const currentDate = new Date(uniqueDays[i]);
      const nextDate = new Date(uniqueDays[i + 1]);

      const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }
}
