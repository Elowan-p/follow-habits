import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackingDTO {
  @ApiProperty({ example: 'habit-uuid' })
  @IsString()
  @IsNotEmpty()
  habitId: string;

  @ApiProperty({ example: '2023-10-27T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'completed' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
