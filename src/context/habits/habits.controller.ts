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
  UseGuards,
  Request,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { HabitPresenter } from './presenter/habit.presenter';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import {
  HABITS_CREATE,
  HABITS_READ,
  HABITS_UPDATE,
  HABITS_DELETE,
} from '../../core/rights/rights.constants';

@ApiTags('Habits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create habit' })
  @ApiResponse({ status: 201, type: HabitPresenter })
  @RequireRights(HABITS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHabitDto: CreateHabitDTO, @Request() req: any) {
    const habit = this.habitsService.create(createHabitDto, req.user.id);
    return plainToInstance(HabitPresenter, habit);
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits' })
  @ApiResponse({ status: 200, type: [HabitPresenter] })
  @RequireRights(HABITS_READ)
  @HttpCode(HttpStatus.OK)
  findAll() {
    const habits = this.habitsService.findAll();
    return plainToInstance(HabitPresenter, habits);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get habit by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @RequireRights(HABITS_READ)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    const habit = this.habitsService.findOne(id);
    return plainToInstance(HabitPresenter, habit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update habit' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @RequireRights(HABITS_UPDATE)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDTO) {
    const habit = this.habitsService.update(id, updateHabitDto);
    return plainToInstance(HabitPresenter, habit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete habit' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @RequireRights(HABITS_DELETE)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const habit = this.habitsService.remove(id);
    return plainToInstance(HabitPresenter, habit);
  }
}
