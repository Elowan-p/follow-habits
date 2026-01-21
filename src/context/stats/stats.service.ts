import { Injectable } from '@nestjs/common';
import { CreateStatDTO } from './dto/create-stat.dto';
import { UpdateStatDTO } from './dto/update-stat.dto';

interface Stat {
  id: string;
  userId: string;
  value: number;
}

@Injectable()
export class StatsService {
  private stats: Stat[] = [
    { id: '1', userId: '1', value: 100 },
  ];

  create(createStatDto: CreateStatDTO) {
    const stat: Stat = { id: Date.now().toString(), ...createStatDto };
    this.stats.push(stat);
    return {
      ...stat,
      totalHabits: 5,
      completedTrackings: 20,
      successRate: '80%',
    }; // Mocking return for presenter
  }

  getStats() {
    return {
      totalHabits: 5,
      completedTrackings: 20,
      successRate: '80%',
    };
  }

  update(id: string, updateStatDto: UpdateStatDTO) {
    const statIndex = this.stats.findIndex(s => s.id === id);
    if (statIndex > -1) {
      this.stats[statIndex] = { ...this.stats[statIndex], ...updateStatDto };
      return {
        ...this.stats[statIndex],
        totalHabits: 5,
        completedTrackings: 20,
        successRate: '80%',
      };
    }
    return null;
  }

  remove(id: string) {
    const statIndex = this.stats.findIndex(s => s.id === id);
    if (statIndex > -1) {
      const deletedStat = this.stats[statIndex];
      this.stats.splice(statIndex, 1);
      return {
        ...deletedStat,
        totalHabits: 5,
        completedTrackings: 20,
        successRate: '80%',
      };
    }
    return null;
  }
}
