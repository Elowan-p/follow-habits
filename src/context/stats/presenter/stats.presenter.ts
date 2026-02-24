import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatsPresenter {
  @ApiPropertyOptional()
  @Expose()
  userId?: string;

  @ApiProperty()
  @Expose()
  totalHabits: number;

  @ApiProperty()
  @Expose()
  category: string;

  @ApiProperty()
  @Expose()
  totalTrackings: number;

  @ApiProperty()
  @Expose()
  completedTrackings: number;

  @ApiProperty()
  @Expose()
  completionRate: string;

  @ApiProperty()
  @Expose()
  longestStreak: number;
}
