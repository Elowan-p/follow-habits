import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepositoryInterface } from './auth.repository.interface';
import { loginDTO } from './dto/login.dto';
import { registerDTO } from './dto/register.dto';
import { AuthCredentialEntity } from './entities/auth-credential.entity';
import { IJwtService } from './jwt.ports';

import { UsersRepositoryInterface } from '../users/users.repository.interface';
import { UserEntity } from '../users/entities/user.entity';
import { AuthError } from './error/auth.error';
import { EVENT_BUS } from '../../core/event/event-bus.port';
import type { EventBusPort } from '../../core/event/event-bus.port';
import { UserRegisteredEvent } from './event/user-registered.event';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    @Inject(IJwtService)
    private readonly jwtService: IJwtService,
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBusPort,
  ) {}

  async register(body: registerDTO) {
    // 1. Create AuthCredential
    const authCredential = new AuthCredentialEntity();
    authCredential.email = body.email;
    authCredential.passwordHashed = await bcrypt.hash(body.password, 10);
    const savedAuth =
      await this.authRepository.createCredential(authCredential);
    // 2. Create User Profile
    const user = new UserEntity();
    user.email = body.email;
    user.name = body.username;
    user.auth = savedAuth;
    await this.usersRepository.create(user);

    await this.eventBus.publish(
      UserRegisteredEvent.create({
        email: body.email,
        id: savedAuth.id,
        username: body.username,
      }),
    );

    return savedAuth;
  }

  async login(body: loginDTO) {
    const user = await this.authRepository.findCredentialByEmail(body.email);
    if (!user) {
      throw new AuthError({
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const isMatch = await bcrypt.compare(body.password, user.passwordHashed);
    if (!isMatch) {
      throw new AuthError({
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    const payload = { email: user.email, sub: user.id };
    const tokens = this.jwtService.signToken(payload);

    const refreshTokenHashed = await bcrypt.hash(tokens.refresh_token, 10);
    await this.authRepository.updateRefreshToken(user.id, refreshTokenHashed);

    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verifyToken(refreshToken);
      const user = await this.authRepository.findCredentialByEmail(
        payload.email,
      );

      if (!user || !user.refreshTokenHashed) {
        throw new AuthError({
          code: 'AUTH_ACCESS_DENIED',
          message: 'Access denied',
          statusCode: 401,
        });
      }

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHashed,
      );

      if (!isRefreshTokenMatching) {
        throw new AuthError({
          code: 'AUTH_ACCESS_DENIED',
          message: 'Access denied',
          statusCode: 401,
        });
      }

      const newPayload = { email: user.email, sub: user.id };
      const tokens = this.jwtService.signToken(newPayload);

      const refreshTokenHashed = await bcrypt.hash(tokens.refresh_token, 10);
      await this.authRepository.updateRefreshToken(user.id, refreshTokenHashed);

      return tokens;
    } catch {
      throw new AuthError({
        code: 'AUTH_INVALID_REFRESH_TOKEN',
        message: 'Invalid or expired refresh token',
        statusCode: 401,
      });
    }
  }
}
