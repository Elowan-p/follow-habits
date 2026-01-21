import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StatsPresenter {
  @ApiProperty()
  @Expose()
  totalHabits: number;

  @ApiProperty()
  @Expose()
  completedTrackings: number;

  @ApiProperty()
  @Expose()
  successRate: string;
}
