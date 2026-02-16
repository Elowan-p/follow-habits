import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
//Regarder en ligne de commande pour voir l'email reçu il y aura un lien ethereal pour voir le corps du mail et ce qui est dit dedans
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
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

  async sendUserWelcome(email: string) {
    if (!this.transporter) {
      await this.initTransporter();
    }

    const from = this.configService.get<string>('MAIL_FROM');
    const info = await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Welcome to Follow Habits!',
      text: 'Welcome to Follow Habits! We are glad to have you with us.',
      html: '<b>Welcome to Follow Habits!</b><br>We are glad to have you with us.',
    });
    console.log(`[EmailService] Welcome email sent to ${email}`);
    console.log(
      `[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
    );
  }
}
