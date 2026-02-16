import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.ports';
import { AuthError } from './error/auth.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new AuthError({
        code: 'AUTH_INVALID_TOKEN',
        message: 'Invalid token payload',
        statusCode: 401,
      });
    }
    return { userId: payload.sub, email: payload.email };
  }
}
