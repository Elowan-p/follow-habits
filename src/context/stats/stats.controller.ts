import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsPresenter } from './presenter/stats.presenter';
import { plainToInstance } from 'class-transformer';
@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get stats' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @HttpCode(HttpStatus.OK)
  async getStats() {
    const stats = await this.statsService.getGlobalStats();
    return plainToInstance(StatsPresenter, stats);
  }
}
