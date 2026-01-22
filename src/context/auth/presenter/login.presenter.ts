import { Expose, Type } from 'class-transformer';
import { UserPresenter } from '../../users/presenter/user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPresenter {
  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  access_token: string;

  @ApiProperty()
  @Expose()
  refresh_token: string;
}
