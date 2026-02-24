import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AUTH_USER_REGISTER_EVENT,
  UserRegisteredEvent,
} from '../event/user-registered.event';
import { EmailService } from '../../notification/email.service';
import {
  getWelcomeEmailHtml,
  getWelcomeEmailSubject,
} from '../../notification/templates/welcome-template';

@Injectable()
export class SendUserRegisteredHandler {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(AUTH_USER_REGISTER_EVENT)
  async handle(event: UserRegisteredEvent) {
    const payload = (event['payload'] || event) as {
      email: string;
      username: string;
    };

    if (payload.email) {
      await this.emailService.send({
        to: payload.email,
        subject: getWelcomeEmailSubject(),
        html: getWelcomeEmailHtml(payload.username),
      });
    }
  }
}
