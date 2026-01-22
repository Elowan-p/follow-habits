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
}
