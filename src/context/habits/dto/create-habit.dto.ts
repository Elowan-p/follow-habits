import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDTO {
  @ApiProperty({ example: 'Eco-friendly' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Reduce plastic usage' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
