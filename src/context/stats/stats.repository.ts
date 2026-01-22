import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatEntity } from './entities/stats.entity';
import { StatsRepositoryInterface } from './stats.repository.interface';

@Injectable()
export class StatsRepository implements StatsRepositoryInterface {
  constructor(
    @InjectRepository(StatEntity)
    private readonly repository: Repository<StatEntity>,
  ) {}

  async create(stat: StatEntity): Promise<StatEntity> {
    return this.repository.save(stat);
  }

  async findAllByUserId(userId: string): Promise<StatEntity[]> {
    return this.repository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<StatEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(stat: StatEntity): Promise<StatEntity> {
    return this.repository.save(stat);
  }

  async remove(stat: StatEntity): Promise<StatEntity> {
    return this.repository.remove(stat);
  }
}
