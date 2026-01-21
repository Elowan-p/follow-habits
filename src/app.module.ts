import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './context/users/users.module';
import { HabitsModule } from './context/habits/habits.module';
import { TrackingModule } from './context/tracking/tracking.module';
import { StatsModule } from './context/stats/stats.module';

@Module({
  imports: [UsersModule, HabitsModule, TrackingModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
