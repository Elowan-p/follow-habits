import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCredentialEntity } from './entities/auth-credential.entity';
import { AuthRepository } from './auth.repository';
import { AuthRepositoryInterface } from './auth.repository.interface';
import { CustomJwtService } from './jwt.service';
import { IJwtService } from './jwt.ports';
import { JwtController } from './jwt.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthCredentialEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController, JwtController],
  providers: [
    AuthService,
    { provide: AuthRepositoryInterface, useClass: AuthRepository },
    { provide: IJwtService, useClass: CustomJwtService },
  ],
})
export class AuthModule {}
