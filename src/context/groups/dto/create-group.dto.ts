import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'The name of the group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'A description for the group' })
  @IsString()
  @IsOptional()
  description?: string;
}
