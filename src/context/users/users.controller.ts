import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as usersType from './dto/users.dto';
import { plainToInstance } from 'class-transformer';
import { FindAllPresenter } from './presenter/findAll.presenter';
import { FindOnePresenter } from './presenter/findOne.presenter';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: FindAllPresenter })
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: usersType.findAllDTO) {
    const response = this.usersService.findAll(query);
    return plainToInstance(FindAllPresenter, response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  findOne(@Param() params: usersType.findOneDTO) {
    const response = this.usersService.findOne(params);
    return plainToInstance(FindOnePresenter, response);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const response = this.usersService.update(id, body);
    return plainToInstance(FindOnePresenter, response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const response = this.usersService.remove(id);
    return plainToInstance(FindOnePresenter, response);
  }
}
