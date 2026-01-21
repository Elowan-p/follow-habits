import { Injectable } from '@nestjs/common';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';

interface Habit {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class HabitsService {
  private habits: Habit[] = [];
  
  create(createHabitDto: CreateHabitDTO) {
    const habit: Habit = { id: Date.now().toString(), ...createHabitDto };
    this.habits.push(habit);
    return habit;
  }

  findAll() {
    return this.habits;
  }

  findOne(id: string) {
    return this.habits.find((habit) => habit.id === id);
  }

  update(id: string, updateHabitDto: UpdateHabitDTO) {
    const habitIndex = this.habits.findIndex((habit) => habit.id === id);
    if (habitIndex > -1) {
      const currentHabit = this.habits[habitIndex];
      const updatedHabit = {
        ...currentHabit,
        ...updateHabitDto,
      };
      this.habits[habitIndex] = updatedHabit;
      return updatedHabit;
    }
    return null;
  }

  remove(id: string) {
    const habitIndex = this.habits.findIndex((habit) => habit.id === id);
    if (habitIndex > -1) {
      const deletedHabit = this.habits[habitIndex];
      this.habits.splice(habitIndex, 1);
      return deletedHabit;
    }
    return null;
  }
}
