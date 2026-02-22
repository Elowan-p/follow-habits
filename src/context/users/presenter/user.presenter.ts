import { Expose, Transform } from 'class-transformer';
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

  @ApiProperty({
    description: 'User rights mask (BigInt as string)',
    example: '1',
    type: String,
  })
  @Expose()
  @Transform(({ value }) => String(value))
  rights: bigint;
}
