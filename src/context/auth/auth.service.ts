/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(body: any) {
    return {
      message: 'Connexion réussie',
      data: body,
    };
  }
  register(body: any) {
    return {
      message: 'Inscription réussie',
      data: body,
    };
  }
}
