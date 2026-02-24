import { HabitEntity } from './entities/habit.entity';

export abstract class HabitsRepositoryInterface {
  abstract create(habit: HabitEntity): Promise<HabitEntity>;
  abstract findAll(category?: string, userId?: string): Promise<HabitEntity[]>;
  abstract findOne(id: string): Promise<HabitEntity | null>;
  abstract update(habit: HabitEntity): Promise<HabitEntity>;
  abstract remove(habit: HabitEntity): Promise<HabitEntity>;
}
