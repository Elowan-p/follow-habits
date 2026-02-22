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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import { USER_READ } from '../../core/rights/rights.constants';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: FindAllPresenter })
  @HttpCode(HttpStatus.OK)
  @RequireRights(USER_READ)
  findAll(@Query() query: usersType.findAllDTO) {
    const response = this.usersService.findAll(query);
    return plainToInstance(FindAllPresenter, response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  @RequireRights(USER_READ)
  findOne(@Param('id') id: string) {
    const response = this.usersService.findOne({ id });
    return plainToInstance(FindOnePresenter, response);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const response = this.usersService.update(id, body);
    return plainToInstance(FindOnePresenter, response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: FindOnePresenter })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const response = this.usersService.remove(id);
    return plainToInstance(FindOnePresenter, response);
  }
}
