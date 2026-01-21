import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HabitPresenter {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;
}
