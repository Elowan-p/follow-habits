import { Expose, Type } from 'class-transformer';
import { UserPresenter } from '../../users/presenter/user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPresenter {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty({ type: UserPresenter })
  @Expose()
  @Type(() => UserPresenter)
  data: UserPresenter;
}
