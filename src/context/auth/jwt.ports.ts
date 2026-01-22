export interface JwtPayload {
  email: string;
  sub: string;
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
}

export const IJwtService = Symbol('IJwtService');

export interface IJwtService {
  signToken(payload: JwtPayload): AuthToken;
  signRefreshToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload;
}
