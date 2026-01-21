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
import { CreateStatDTO } from './dto/create-stat.dto';
import { UpdateStatDTO } from './dto/update-stat.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create stat' })
  @ApiResponse({ status: 201, type: StatsPresenter })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStatDto: CreateStatDTO) {
    const stat = this.statsService.create(createStatDto);
    return plainToInstance(StatsPresenter, stat);
  }

  @Get()
  @ApiOperation({ summary: 'Get stats' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @HttpCode(HttpStatus.OK)
  getStats() {
    const stats = this.statsService.getStats();
    return plainToInstance(StatsPresenter, stats);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update stat' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDTO) {
    const stat = this.statsService.update(id, updateStatDto);
    return plainToInstance(StatsPresenter, stat);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stat' })
  @ApiResponse({ status: 200, type: StatsPresenter })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const stat = this.statsService.remove(id);
    return plainToInstance(StatsPresenter, stat);
  }
}
