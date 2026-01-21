import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as authType from './auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: authType.loginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() body: authType.registerDTO) {
    return this.authService.register(body);
  }
}
