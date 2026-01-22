import { Injectable } from '@nestjs/common';
import { HabitsRepositoryInterface } from '../habits/habits.repository.interface';
import { TrackingRepositoryInterface } from '../tracking/tracking.repository.interface';

import { Injectable } from '@nestjs/common';
export class StatsService {
  constructor(
    private readonly habitsRepository: HabitsRepositoryInterface,
    private readonly trackingRepository: TrackingRepositoryInterface,
  ) {}

  // Dynamic stats calculation
  async getGlobalStats() {
    const habits = await this.habitsRepository.findAll();
    const trackings = await this.trackingRepository.findAll();

    return {
      totalHabits: habits.length,
      totalTrackings: trackings.length,
      // Simple completion rate calculation (just an example)
      completionRate: trackings.length > 0 ? 'Recently Active' : 'No Activity',
    };
  }
}
