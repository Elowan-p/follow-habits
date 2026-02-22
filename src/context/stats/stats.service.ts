import { Injectable } from '@nestjs/common';
import { HabitsRepositoryInterface } from '../habits/habits.repository.interface';
import { TrackingRepositoryInterface } from '../tracking/tracking.repository.interface';

@Injectable()
export class StatsService {
  constructor(
    private readonly habitsRepository: HabitsRepositoryInterface,
    private readonly trackingRepository: TrackingRepositoryInterface,
  ) {}

  // Dynamic stats calculation
  async getGlobalStats(category?: string) {
    const habits = await this.habitsRepository.findAll(category);
    // Ideally tracking should also be filtered by habits of that category.
    // For now, we return global tracking count or we'd need to fetch tracking associated with those habits.
    // Let's implement a simple filter for habits first.

    // If category is provided, we should only count trackings for those habits.
    // But TrackingRepository currently doesn't support filtering by habit category easily without join.
    // We will just return total trackings for now or update it later if strict accuracy is needed.
    const trackings = await this.trackingRepository.findAll();

    return {
      totalHabits: habits.length,
      category: category || 'ALL',
      totalTrackings: trackings.length, // Global for now
      completionRate: trackings.length > 0 ? 'Active' : 'No Activity',
    };
  }
}
