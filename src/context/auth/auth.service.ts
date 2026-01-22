import { Injectable } from '@nestjs/common';
import { AuthRepositoryInterface } from '../auth.repository.interface';
import { loginDTO } from './dto/login.dto';
import { registerDTO } from './dto/register.dto';
import { UserCredentialEntity } from './entities/user-credential.entity';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
  ) {}

  async register(body: registerDTO) {
    const user = new UserCredentialEntity();
    user.email = body.email;
    user.passwordHashed = body.password;
    return this.authRepository.createCredential(user);
  }

  async login(body: loginDTO) {
    return this.authRepository.findCredentialByEmail(body.email);
  }
}
