import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TrackingPresenter {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  habitId: string;

  @ApiProperty()
  @Expose()
  date: string;

  @ApiProperty()
  @Expose()
  status: string;
}
