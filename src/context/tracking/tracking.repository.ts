import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingEntity } from './entities/tracking.entity';
import { TrackingRepositoryInterface } from './tracking.repository.interface';

@Injectable()
export class TrackingRepository implements TrackingRepositoryInterface {
  constructor(
    @InjectRepository(TrackingEntity)
    private readonly repository: Repository<TrackingEntity>,
  ) {}

  async create(tracking: TrackingEntity): Promise<TrackingEntity> {
    return this.repository.save(tracking);
  }

  async findAll(): Promise<TrackingEntity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<TrackingEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(tracking: TrackingEntity): Promise<TrackingEntity> {
    return this.repository.save(tracking);
  }

  async remove(tracking: TrackingEntity): Promise<TrackingEntity> {
    return this.repository.remove(tracking);
  }

  async getStats(filters: {
    userId?: string;
    category?: string;
  }): Promise<{ totalTrackings: number; completedTrackings: number }> {
    const query = this.repository
      .createQueryBuilder('tracking')
      .innerJoin('tracking.habit', 'habit');

    if (filters.userId) {
      query.andWhere('habit.user.id = :userId', {
        userId: filters.userId,
      });
    }
    if (filters.category) {
      query.andWhere('habit.category = :category', {
        category: filters.category,
      });
    }

    const totalTrackings = await query.getCount();

    const completedQuery = this.repository
      .createQueryBuilder('tracking')
      .innerJoin('tracking.habit', 'habit')
      .where('tracking.status = :status', { status: 'completed' });

    if (filters.userId) {
      completedQuery.andWhere('habit.user.id = :userId', {
        userId: filters.userId,
      });
    }
    if (filters.category) {
      completedQuery.andWhere('habit.category = :category', {
        category: filters.category,
      });
    }

    const completedTrackings = await completedQuery.getCount();

    return { totalTrackings, completedTrackings };
  }

  async getTrackingDatesForStreak(filters: {
    userId?: string;
    category?: string;
  }): Promise<Date[]> {
    const query = this.repository
      .createQueryBuilder('tracking')
      .innerJoin('tracking.habit', 'habit')
      .where('tracking.status = :status', { status: 'completed' })
      .select('tracking.date', 'date')
      .orderBy('tracking.date', 'DESC');

    if (filters.userId) {
      query.andWhere('habit.user.id = :userId', {
        userId: filters.userId,
      });
    }
    if (filters.category) {
      query.andWhere('habit.category = :category', {
        category: filters.category,
      });
    }

    const results = await query.getRawMany();
    return results.map((r: any) => new Date(r.date as string));
  }
}
