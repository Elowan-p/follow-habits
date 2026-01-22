import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatEntity } from './entities/stats.entity';
import { StatsRepositoryInterface } from './stats.repository.interface';
import { StatsRepository } from './stats.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatEntity])],
  controllers: [StatsController],
  providers: [
    StatsService,
    { provide: StatsRepositoryInterface, useClass: StatsRepository },
  ],
})
export class StatsModule {}
