import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsPresenter } from './presenter/stats.presenter';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { HabitCategory } from '../../context/habits/enums/habit-category.enum';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import { STATS_READ } from '../../core/rights/rights.constants';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get stats' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: HabitCategory,
    description: 'Filter stats by habit category',
  })
  @RequireRights(STATS_READ)
  @HttpCode(HttpStatus.OK)
  async getStats(@Query('category') category?: string) {
    const stats = await this.statsService.getGlobalStats(category);
    return plainToInstance(StatsPresenter, stats);
  }
}
/**
 * faire des stats avec des filtres du types santès etc...
 * Permet de vendre certains type de données par exemple x% de personnes à une/des habitudes dans x types de stats
 */
