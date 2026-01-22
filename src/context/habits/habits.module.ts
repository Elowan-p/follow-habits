import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitEntity } from './entities/habit.entity';
import { HabitsRepositoryInterface } from './habits.repository.interface';
import { HabitsRepository } from './habits.repository';

@Module({
  imports: [HabitEntity],
  controllers: [HabitsController],
  providers: [
    HabitsService,
    { provide: HabitsRepositoryInterface, useClass: HabitsRepository },
  ],
})
export class HabitsModule {}
