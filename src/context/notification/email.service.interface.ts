export interface SendEmailDto {
  to: string;
  subject: string;
  html: string;
}

export const EmailServiceInterface = Symbol('EmailServiceInterface');

export interface EmailServiceInterface {
  send(payload: SendEmailDto): Promise<void>;
}
