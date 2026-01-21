import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class loginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class registerDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
