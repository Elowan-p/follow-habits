export const AUTH_USER_REGISTER_EVENT = 'user.registered';

export class UserRegisteredEvent {
  static eventName = AUTH_USER_REGISTER_EVENT;
  static create(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { eventName: UserRegisteredEvent.eventName, payload };
  }
}
