import { TrackingEntity } from './entities/tracking.entity';

export abstract class TrackingRepositoryInterface {
  abstract create(tracking: TrackingEntity): Promise<TrackingEntity>;
  abstract findAll(): Promise<TrackingEntity[]>;
  abstract findOne(id: string): Promise<TrackingEntity | null>;
  abstract update(tracking: TrackingEntity): Promise<TrackingEntity>;
  abstract remove(tracking: TrackingEntity): Promise<TrackingEntity>;
}
