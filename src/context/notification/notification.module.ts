import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { UserRegisteredHandler } from './handlers/user-registered.handler';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, UserRegisteredHandler],
  exports: [EmailService],
})
export class NotificationModule {}
