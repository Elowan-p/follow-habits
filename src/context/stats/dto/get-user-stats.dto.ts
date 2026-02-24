import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HabitCategory } from '../../habits/enums/habit-category.enum';

export class GetUserStatsDto {
  @ApiPropertyOptional({
    description: 'Filter stats by a specific habit category',
    enum: HabitCategory,
  })
  @IsOptional()
  @IsEnum(HabitCategory)
  category?: HabitCategory;

  @ApiPropertyOptional({
    description: 'Time period for the stats (e.g., week, month, year)',
    type: String,
  })
  @IsOptional()
  @IsString()
  period?: string;
}
