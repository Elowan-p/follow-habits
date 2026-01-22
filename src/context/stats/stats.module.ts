import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatEntity } from './entities/stats.entity';
import { StatsRepositoryInterface } from './stats.repository.interface';
import { StatsRepository } from './stats.repository';

import { HabitsModule } from '../habits/habits.module';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatEntity]),
    HabitsModule,
    TrackingModule,
  ],
  controllers: [StatsController],
  providers: [
    StatsService,
    { provide: StatsRepositoryInterface, useClass: StatsRepository },
  ],
})
export class StatsModule {}
