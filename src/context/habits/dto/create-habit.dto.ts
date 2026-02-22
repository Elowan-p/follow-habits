import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HabitCategory } from '../enums/habit-category.enum';

export class CreateHabitDTO {
  @ApiProperty({ example: 'Eco-friendly' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Reduce plastic usage' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: HabitCategory, example: HabitCategory.HEALTH })
  @IsEnum(HabitCategory)
  @IsOptional()
  category?: HabitCategory;
}
