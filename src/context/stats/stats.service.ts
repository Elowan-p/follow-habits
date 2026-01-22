import { Injectable, NotFoundException } from '@nestjs/common';
import { StatsRepositoryInterface } from './stats.repository.interface';
import { CreateStatDTO } from './dto/create-stat.dto';
import { UpdateStatDTO } from './dto/update-stat.dto';
import { StatEntity } from './entities/stats.entity';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepositoryInterface) {}

  async create(CreateStatDTO: CreateStatDTO) {
    const stat = new StatEntity();
    stat.userId = CreateStatDTO.userId;
    stat.value = CreateStatDTO.value;

    const savedStat = await this.statsRepository.create(stat);

    return {
      ...savedStat,
      totalHabit: 0,
      completedTracking: 0,
      totalTracking: 0,
    };
  }

  async getStats() {
    const stats = await this.statsRepository.findAllByUserId('some-user-id'); // À adapter

    return {
      totalHabits: stats.length,
      completedTrackings: 0,
      successRate: '0%',
    };
  }

  async update(id: string, updateStatDTO: UpdateStatDTO) {
    const stat = await this.statsRepository.findOne(id);
    if (!stat) throw new NotFoundException('Statistique non trouvée');

    const updateStatEntity = { ...stat, ...updateStatDTO } as StatEntity;
    const savedStat = await this.statsRepository.update(updateStatEntity);

    return {
      ...savedStat,
      totalHabit: 0,
      completedTracking: 0,
      successRate: '0%',
    };
  }

  async remove(id: string) {
    const stat = await this.statsRepository.findOne(id);
    if (!stat) throw new NotFoundException('Statistique non trouvée');

    const removed = await this.statsRepository.remove(stat);

    return {
      ...removed,
      totalHabits: 0,
      completedTrackings: 0,
      successRate: '0%',
    };
  }
}
