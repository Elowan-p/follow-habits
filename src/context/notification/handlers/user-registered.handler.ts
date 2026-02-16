import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AUTH_USER_REGISTER_EVENT,
  UserRegisteredEvent,
} from '../../auth/event/user-registered.event';
import { EmailService } from '../email.service';

@Injectable()
export class UserRegisteredHandler {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(AUTH_USER_REGISTER_EVENT)
  async handle(event: UserRegisteredEvent) {
    const payload = (event['payload'] || event) as { email: string };
    if (payload.email) {
      await this.emailService.sendUserWelcome(payload.email);
    }
  }
}
