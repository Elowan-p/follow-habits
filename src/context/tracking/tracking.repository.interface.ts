import { TrackingEntity } from './entities/tracking.entity';

export abstract class TrackingRepositoryInterface {
  abstract create(tracking: TrackingEntity): Promise<TrackingEntity>;
  abstract findAll(): Promise<TrackingEntity[]>;
  abstract findOne(id: string): Promise<TrackingEntity | null>;
  abstract update(tracking: TrackingEntity): Promise<TrackingEntity>;
  abstract remove(tracking: TrackingEntity): Promise<TrackingEntity>;
  
  abstract getStats(
    filters: {
      userId?: string;
      category?: string;
    }
  ): Promise<{ totalTrackings: number; completedTrackings: number }>;
  abstract getTrackingDatesForStreak(
    filters: {
      userId?: string;
      category?: string;
    }
  ): Promise<Date[]>;
}
