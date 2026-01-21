import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserPresenter {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;
}
