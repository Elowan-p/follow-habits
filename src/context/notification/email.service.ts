import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailServiceInterface, SendEmailDto } from './email.service.interface';
//Regarder en ligne de commande pour voir l'email reçu il y aura un lien ethereal pour voir le corps du mail et ce qui est dit dedans
@Injectable()
export class EmailService implements EmailServiceInterface {
  private transporter: nodemailer.Transporter;
  private initPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {
    this.initPromise = this.initTransporter();
  }

  private async initTransporter() {
    let user = this.configService.get<string>('MAIL_USER');
    let pass = this.configService.get<string>('MAIL_PASS');

    if (!user || user === 'user') {
      console.log(
        '[EmailService] No valid mail credentials found. Generating Ethereal test account...',
      );
      const testAccount = await nodemailer.createTestAccount();
      user = testAccount.user;
      pass = testAccount.pass;
      console.log(`[EmailService] Generated Ethereal User: ${user}`);
      console.log(`[EmailService] Generated Ethereal Pass: ${pass}`);
    }

    this.transporter = nodemailer.createTransport({
      host:
        this.configService.get<string>('MAIL_HOST') || 'smtp.ethereal.email',
      port: this.configService.get<number>('MAIL_PORT') || 587,
      auth: {
        user,
        pass,
      },
    });
  }

  async send(payload: SendEmailDto): Promise<void> {
    await this.initPromise;
    if (!this.transporter) {
      // Should not happen if initPromise resolves correctly, but safe guard
      await this.initTransporter();
    }

    const from =
      this.configService.get<string>('MAIL_FROM') ||
      '"Follow Habits" <noreply@followhabits.com>';
    const info = await this.transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    console.log(`[EmailService] Email sent to ${payload.to}`);
    console.log(
      `[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
    );
  }
}
