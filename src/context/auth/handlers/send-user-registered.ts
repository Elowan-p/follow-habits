/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AUTH_USER_REGISTER_EVENT,
  UserRegisteredEvent,
} from '../event/user-registered.event';

@Injectable()
export class SendUserRegisteredHandler {
  @OnEvent(AUTH_USER_REGISTER_EVENT)
  async handle(event: UserRegisteredEvent) {
    console.log(event);
  }
}
