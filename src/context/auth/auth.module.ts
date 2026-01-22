import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialEntity } from './entities/user-credential.entity';
import { AuthRepository } from './auth.repository';
import { AuthRepositoryInterface } from '../auth.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredentialEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: AuthRepositoryInterface, useClass: AuthRepository },
  ],
})
export class AuthModule {}
