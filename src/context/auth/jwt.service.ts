import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, IJwtService, JwtPayload } from './jwt.ports';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomJwtService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signToken(payload: JwtPayload): AuthToken {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.signRefreshToken(payload);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  signRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
