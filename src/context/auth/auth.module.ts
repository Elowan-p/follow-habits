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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { EventModule } from '../../core/event/event.module';
import { SendUserRegisteredHandler } from './handlers/send-user-registered';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthCredentialEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UsersModule,
    ConfigModule,
    EventModule,
    NotificationModule,
  ],
  controllers: [AuthController, JwtController],
  providers: [
    AuthService,
    JwtStrategy,
    SendUserRegisteredHandler,
    { provide: AuthRepositoryInterface, useClass: AuthRepository },
    { provide: IJwtService, useClass: CustomJwtService },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
