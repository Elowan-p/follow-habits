import { Controller, HttpCode, Post, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { registerDTO } from './dto/register.dto';
import { LoginPresenter } from './presenter/login.presenter';
import { plainToInstance } from 'class-transformer';
import { RegisterPresenter } from './presenter/register.presenter';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginPresenter })
  @HttpCode(HttpStatus.OK)
  login(@Body() body: loginDTO) {
    const response = this.authService.login(body);
    return plainToInstance(LoginPresenter, response);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 200, type: RegisterPresenter })
  @HttpCode(HttpStatus.OK)
  register(@Body() body: registerDTO) {
    const response = this.authService.register(body);
    return plainToInstance(RegisterPresenter, response);
  }
}
