import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupHabitDto } from './dto/add-group-habit.dto';
import { TrackGroupHabitDto } from './dto/track-group-habit.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { HabitCategory } from '../habits/enums/habit-category.enum';
import { TrackingStatus } from './entities/group-tracking.entity';
import { GroupRole } from './entities/group-member.entity';
import type { Request } from 'express';

describe('GroupsController', () => {
  let controller: GroupsController;

  const mockGroupsService = {
    createGroup: jest.fn(),
    joinGroup: jest.fn(),
    addHabit: jest.fn(),
    trackHabit: jest.fn(),
    getGroupDetails: jest.fn(),
    updateMemberRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    jest.clearAllMocks();
  });

  const mockRequest = (userId: string): Request => {
    return {
      user: { sub: userId },
    } as unknown as Request;
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createGroup', () => {
    it('should call groupsService.createGroup', async () => {
      const dto: CreateGroupDto = { name: 'Test Group', description: 'Desc' };
      const req = mockRequest('user-1');
      mockGroupsService.createGroup.mockResolvedValue({ id: 'g1', ...dto });

      const result = await controller.createGroup(dto, req);

      expect(mockGroupsService.createGroup).toHaveBeenCalledWith(dto, 'user-1');
      expect(result).toEqual({ id: 'g1', ...dto });
    });
  });

  describe('joinGroup', () => {
    it('should call groupsService.joinGroup', async () => {
      const req = mockRequest('user-2');
      mockGroupsService.joinGroup.mockResolvedValue({ id: 'g1' });

      const result = await controller.joinGroup('g1', req);

      expect(mockGroupsService.joinGroup).toHaveBeenCalledWith('g1', 'user-2');
      expect(result).toEqual({ id: 'g1' });
    });
  });

  describe('addHabit', () => {
    it('should call groupsService.addHabit', async () => {
      const dto: AddGroupHabitDto = {
        name: 'Habit 1',
        category: HabitCategory.SPORT,
        pointsReward: 10,
      };
      const req = mockRequest('user-1');
      mockGroupsService.addHabit.mockResolvedValue({ id: 'h1', ...dto });

      const result = await controller.addHabit('g1', dto, req);

      expect(mockGroupsService.addHabit).toHaveBeenCalledWith(
        'g1',
        'user-1',
        dto,
      );
      expect(result).toEqual({ id: 'h1', ...dto });
    });
  });

  describe('trackHabit', () => {
    it('should call groupsService.trackHabit', async () => {
      const dto: TrackGroupHabitDto = { status: TrackingStatus.COMPLETED };
      const req = mockRequest('user-1');
      mockGroupsService.trackHabit.mockResolvedValue({ id: 't1', ...dto });

      const result = await controller.trackHabit('g1', 'h1', dto, req);

      expect(mockGroupsService.trackHabit).toHaveBeenCalledWith(
        'g1',
        'h1',
        'user-1',
        dto,
      );
      expect(result).toEqual({ id: 't1', ...dto });
    });
  });

  describe('getGroup', () => {
    it('should call groupsService.getGroupDetails', async () => {
      mockGroupsService.getGroupDetails.mockResolvedValue({
        id: 'g1',
        name: 'Group',
      });

      const result = await controller.getGroup('g1');

      expect(mockGroupsService.getGroupDetails).toHaveBeenCalledWith('g1');
      expect(result).toEqual({ id: 'g1', name: 'Group' });
    });
  });

  describe('updateMemberRole', () => {
    it('should call groupsService.updateMemberRole', async () => {
      const dto: UpdateMemberRoleDto = { role: GroupRole.CO_ADMIN };
      const req = mockRequest('admin-user');
      mockGroupsService.updateMemberRole.mockResolvedValue({
        role: GroupRole.CO_ADMIN,
      });

      const result = await controller.updateMemberRole(
        'g1',
        'target-user',
        dto,
        req,
      );

      expect(mockGroupsService.updateMemberRole).toHaveBeenCalledWith(
        'g1',
        'target-user',
        GroupRole.CO_ADMIN,
        'admin-user',
      );
      expect(result).toEqual({ role: GroupRole.CO_ADMIN });
    });
  });
});
