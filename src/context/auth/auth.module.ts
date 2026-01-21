import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialEntity } from './entities/user-credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredentialEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
