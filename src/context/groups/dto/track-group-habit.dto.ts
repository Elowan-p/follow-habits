import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TrackingStatus } from '../entities/group-tracking.entity';

export class TrackGroupHabitDto {
  @ApiPropertyOptional({
    enum: TrackingStatus,
    default: TrackingStatus.COMPLETED,
  })
  @IsEnum(TrackingStatus)
  @IsOptional()
  status?: TrackingStatus;
}
