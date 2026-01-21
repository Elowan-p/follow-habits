import { IsString } from 'class-validator';

export class findAllDTO {
  @IsString()
  name: string;
}

export class findOneDTO {
  @IsString()
  id: string;
}
