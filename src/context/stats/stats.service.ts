import { Injectable, NotFoundException } from '@nestjs/common';
import { StatsRepositoryInterface } from './stats.repository.interface';
import { CreateStatDTO } from './dto/create-stat.dto';
import { UpdateStatDTO } from './dto/update-stat.dto';
import { StatEntity } from './entities/stats.entity';

import { Utils } from '...'; // Not needed but just cleaning up
import { HabitsRepositoryInterface } from '../habits/habits.repository.interface';
import { TrackingRepositoryInterface } from '../tracking/tracking.repository.interface';

@Injectable()
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
