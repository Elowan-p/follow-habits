import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

export class RefreshTokenDTO {
  refresh_token: string;
}

@Controller('jwt')
export class JwtController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  verify(@Request() req: any) {
    return { message: 'Token is valid', user: req.user };
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDTO) {
    return this.authService.refresh(body.refresh_token);
  }
}
