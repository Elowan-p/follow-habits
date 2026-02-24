import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsPresenter } from './presenter/stats.presenter';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { GetUserStatsDto } from './dto/get-user-stats.dto';
import { GetGlobalStatsDto } from './dto/get-global-stats.dto';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import { STATS_READ } from '../../core/rights/rights.constants';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user stats' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @HttpCode(HttpStatus.OK)
  async getUserStats(@Req() req: Request, @Query() query: GetUserStatsDto) {
    const userId = (req.user as any)?.sub || (req.user as any)?.id;
    const stats = await this.statsService.getUserStats(userId, query.category);
    return plainToInstance(StatsPresenter, stats, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get global stats or filtered by user/category (Admin)' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @RequireRights(STATS_READ)
  @HttpCode(HttpStatus.OK)
  async getGlobalStats(@Query() query: GetGlobalStatsDto) {
    const stats = await this.statsService.getGlobalStats(
      query.category,
      query.userId,
    );
    return plainToInstance(StatsPresenter, stats, {
      excludeExtraneousValues: true,
    });
  }
}
