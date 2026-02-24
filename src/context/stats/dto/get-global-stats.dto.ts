import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { GetUserStatsDto } from './get-user-stats.dto';

export class GetGlobalStatsDto extends GetUserStatsDto {
  @ApiPropertyOptional({
    description: 'Filter stats for a specific user ID',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
