import { Injectable } from '@nestjs/common';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { HabitsRepositoryInterface } from './habits.repository.interface';
import { UsersRepositoryInterface } from '../users/users.repository.interface';
import { HabitEntity } from './entities/habit.entity';
import { HabitsError } from './error/habits.error';
import { HabitCategory } from './enums/habit-category.enum';
@Injectable()
export class HabitsService {
  constructor(
    private readonly habitsRepository: HabitsRepositoryInterface,
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  /**
   * récupèrer l'entité user et la mettre dans HabitsUser
   * save après création
   */
  async create(CreateHabitDTO: CreateHabitDTO, userId: string) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new HabitsError({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        statusCode: 404,
      });
    }

    const habit = new HabitEntity();
    habit.name = CreateHabitDTO.name;
    habit.description = CreateHabitDTO.description;
    habit.category = CreateHabitDTO.category || HabitCategory.OTHER;
    habit.user = user;

    return this.habitsRepository.create(habit);
  }

  async findAll() {
    return this.habitsRepository.findAll();
  }

  async findOne(id: string) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new HabitsError({
        code: 'HABIT_NOT_FOUND',
        message: `L'habitude recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }
    return habit;
  }

  async update(id: string, updateHabitDTO: UpdateHabitDTO) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new HabitsError({
        code: 'HABIT_NOT_FOUND',
        message: `L'habitude recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }
    const updateHabitEntity = { ...habit, ...updateHabitDTO } as HabitEntity;
    return this.habitsRepository.update(updateHabitEntity);
  }

  async remove(id: string) {
    const habit = await this.habitsRepository.findOne(id);
    if (!habit) {
      throw new HabitsError({
        code: 'HABIT_NOT_FOUND',
        message: `L'habitude recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }
    return habit;
  }
}
