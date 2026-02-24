import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HabitCategory } from '../../../context/habits/enums/habit-category.enum';

export class AddGroupHabitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: HabitCategory,
    default: HabitCategory.OTHER,
  })
  @IsEnum(HabitCategory)
  @IsOptional()
  category?: HabitCategory;

  @ApiPropertyOptional({
    description: 'Points awarded contextually',
    default: 10,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  pointsReward?: number;
}
