import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitEntity } from './entities/habit.entity';
import { HabitsRepositoryInterface } from './habits.repository.interface';
import { HabitsRepository } from './habits.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HabitEntity]), UsersModule],
  controllers: [HabitsController],
  providers: [
    HabitsService,
    { provide: HabitsRepositoryInterface, useClass: HabitsRepository },
  ],
  exports: [HabitsRepositoryInterface],
})
export class HabitsModule {}
