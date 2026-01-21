import { Expose, Type } from 'class-transformer';
import { UserPresenter } from './user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class FindOnePresenter {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ type: UserPresenter })
  @Expose()
  @Type(() => UserPresenter)
  data: UserPresenter;
}
