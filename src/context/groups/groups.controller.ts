import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupHabitDto } from './dto/add-group-habit.dto';
import { TrackGroupHabitDto } from './dto/track-group-habit.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { RightsGuard } from '../../core/rights/guards/rights.guard';
import { RequireRights } from '../../core/rights/decorators/require-rights.decorator';
import {
  GROUPS_CREATE,
  GROUPS_READ,
  GROUPS_UPDATE,
} from '../../core/rights/rights.constants';
import type { Request } from 'express';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RightsGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @RequireRights(GROUPS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    const userId = (req.user as any)?.sub || (req.user as any)?.id;
    return this.groupsService.createGroup(createGroupDto, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join an existing group' })
  @RequireRights(GROUPS_UPDATE)
  @HttpCode(HttpStatus.OK)
  async joinGroup(@Param('id') groupId: string, @Req() req: Request) {
    const userId = (req.user as any)?.sub || (req.user as any)?.id;
    return this.groupsService.joinGroup(groupId, userId);
  }

  @Post(':id/habits')
  @ApiOperation({ summary: 'Add a habit to the group' })
  @RequireRights(GROUPS_UPDATE)
  @HttpCode(HttpStatus.CREATED)
  async addHabit(
    @Param('id') groupId: string,
    @Body() addHabitDto: AddGroupHabitDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.sub || (req.user as any)?.id;
    return this.groupsService.addHabit(groupId, userId, addHabitDto);
  }

  @Post(':groupId/habits/:habitId/track')
  @ApiOperation({ summary: 'Track a group habit to earn points' })
  @RequireRights(GROUPS_UPDATE)
  @HttpCode(HttpStatus.CREATED)
  async trackHabit(
    @Param('groupId') groupId: string,
    @Param('habitId') habitId: string,
    @Body() trackDto: TrackGroupHabitDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.sub || (req.user as any)?.id;
    return this.groupsService.trackHabit(groupId, habitId, userId, trackDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a group (points, badges, members)' })
  @RequireRights(GROUPS_READ)
  @HttpCode(HttpStatus.OK)
  async getGroup(@Param('id') id: string) {
    return this.groupsService.getGroupDetails(id);
  }

  @Post(':groupId/members/:userId/role')
  @ApiOperation({ summary: 'Promote or demote a group member' })
  @RequireRights(GROUPS_UPDATE)
  @HttpCode(HttpStatus.OK)
  async updateMemberRole(
    @Param('groupId') groupId: string,
    @Param('userId') targetUserId: string,
    @Body() updateDto: UpdateMemberRoleDto,
    @Req() req: Request,
  ) {
    const requesterId = (req.user as any)?.sub || (req.user as any)?.id;
    return this.groupsService.updateMemberRole(
      groupId,
      targetUserId,
      updateDto.role,
      requesterId,
    );
  }
}
