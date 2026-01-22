import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './entities/habit.entity';
import { HabitsRepositoryInterface } from './habits.repository.interface';

@Injectable()
export class HabitsRepository implements HabitsRepositoryInterface {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly repository: Repository<HabitEntity>,
  ) {}

  async create(habit: HabitEntity): Promise<HabitEntity> {
    return this.repository.save(habit);
  }

  async findAll(): Promise<HabitEntity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<HabitEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(habit: HabitEntity): Promise<HabitEntity> {
    return this.repository.save(habit);
  }

  async remove(habit: HabitEntity): Promise<HabitEntity> {
    return this.repository.remove(habit);
  }
}
