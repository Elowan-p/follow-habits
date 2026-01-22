import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { HabitsRepositoryInterface } from './habits.repository.interface';
import { HabitEntity } from './entities/habit.entity';
@Injectable()
export class HabitsService {
  constructor(private readonly habitsRepository: HabitsRepositoryInterface) {}

  async create(CreateHabitDTO: CreateHabitDTO) {
    const habit = new HabitEntity();
    habit.name = CreateHabitDTO.name;
    habit.description = CreateHabitDTO.description;

    // TODO: Get real user from request
    habit.user = { id: '00000000-0000-0000-0000-000000000000' } as any;

    return this.habitsRepository.create(habit);
  }

  async findAll() {
    return this.habitsRepository.findAll();
  }

  async findOne(id: string) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new NotFoundException(`L'habitude recherché n'a pas été trouvé`);
    }
    return habit;
  }

  async update(id: string, updateHabitDTO: UpdateHabitDTO) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new NotFoundException(`L'habitude recherché n'a pas été trouvé`);
    }
    const updateHabitEntity = { ...habit, ...updateHabitDTO } as HabitEntity;
    return this.habitsRepository.update(updateHabitEntity);
  }

  async remove(id: string) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new NotFoundException(`L'habitude recherché n'a pas été trouvé`);
    }
    return habit;
  }
}
