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
import { HabitsService } from './habits.service';
import { CreateHabitDTO } from './dto/create-habit.dto';
import { UpdateHabitDTO } from './dto/update-habit.dto';
import { HabitPresenter } from './presenter/habit.presenter';
import { plainToInstance } from 'class-transformer';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Habits')
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create habit' })
  @ApiResponse({ status: 201, type: HabitPresenter })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHabitDto: CreateHabitDTO) {
    const habit = this.habitsService.create(createHabitDto);
    return plainToInstance(HabitPresenter, habit);
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits' })
  @ApiResponse({ status: 200, type: [HabitPresenter] })
  @HttpCode(HttpStatus.OK)
  findAll() {
    const habits = this.habitsService.findAll();
    return plainToInstance(HabitPresenter, habits);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get habit by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    const habit = this.habitsService.findOne(id);
    return plainToInstance(HabitPresenter, habit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update habit' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDTO) {
    const habit = this.habitsService.update(id, updateHabitDto);
    return plainToInstance(HabitPresenter, habit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete habit' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: HabitPresenter })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const habit = this.habitsService.remove(id);
    return plainToInstance(HabitPresenter, habit);
  }
}
