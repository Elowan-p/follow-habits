import { Inject, Injectable } from '@nestjs/common';
import { GroupEntity } from './entities/group.entity';
import { GroupMemberEntity, GroupRole } from './entities/group-member.entity';
import { GroupHabitEntity } from './entities/group-habit.entity';
import {
  GroupTrackingEntity,
  TrackingStatus,
} from './entities/group-tracking.entity';
import type { GroupsRepositoryInterface } from './groups.repository.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupHabitDto } from './dto/add-group-habit.dto';
import { TrackGroupHabitDto } from './dto/track-group-habit.dto';
import { GroupsError } from './error/groups.error';
import { UsersRepositoryInterface } from '../users/users.repository.interface';
import { UsersError } from '../users/error/users.error';
import { HabitCategory } from '../habits/enums/habit-category.enum';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GroupsRepositoryInterface')
    private readonly groupsRepo: GroupsRepositoryInterface,
    @Inject(UsersRepositoryInterface)
    private readonly usersRepo: UsersRepositoryInterface,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, userId: string) {
    const user = await this.usersRepo.findOneById(userId);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        statusCode: 404,
        message: 'User not found',
      });
    }

    const group = new GroupEntity();
    group.name = createGroupDto.name;
    group.description = createGroupDto.description || '';
    group.points = 0;
    group.badges = [];
    
    // Save group first
    const savedGroup = await this.groupsRepo.createGroup(group);

    // Add user as admin member
    const member = new GroupMemberEntity();
    member.group = savedGroup;
    member.user = user;
    member.role = GroupRole.ADMIN;
    await this.groupsRepo.addMember(member);

    return this.groupsRepo.findGroupById(savedGroup.id);
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.groupsRepo.findGroupById(groupId);
    if (!group) throw GroupsError.groupNotFound(groupId);

    const user = await this.usersRepo.findOneById(userId);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        statusCode: 404,
        message: 'User not found',
      });
    }

    const existingMembers = await this.groupsRepo.findMembersByGroupId(groupId);
    const isAlreadyMember = existingMembers.some((m) => m.user.id === userId);
    
    if (isAlreadyMember) {
      return group; // Already joined
    }

    const member = new GroupMemberEntity();
    member.group = group;
    member.user = user;
    member.role = GroupRole.MEMBER;
    await this.groupsRepo.addMember(member);

    return this.groupsRepo.findGroupById(groupId);
  }

  async addHabit(groupId: string, userId: string, addHabitDto: AddGroupHabitDto) {
    const group = await this.groupsRepo.findGroupById(groupId);
    if (!group) throw GroupsError.groupNotFound(groupId);

    const members = await this.groupsRepo.findMembersByGroupId(groupId);
    const userMember = members.find((m) => m.user.id === userId);

    if (!userMember) throw GroupsError.notMember();

    if (userMember.role !== GroupRole.ADMIN && userMember.role !== GroupRole.CO_ADMIN) {
      throw GroupsError.notMember(); // Could be a specific InsufficientGroupRights error, but this works
    }

    const habit = new GroupHabitEntity();
    habit.group = group;
    habit.name = addHabitDto.name;
    habit.description = addHabitDto.description || '';
    habit.category = addHabitDto.category || HabitCategory.OTHER;
    habit.pointsReward = addHabitDto.pointsReward || 10;

    return this.groupsRepo.createHabit(habit);
  }

  async trackHabit(
    groupId: string,
    habitId: string,
    userId: string,
    trackDto: TrackGroupHabitDto,
  ) {
    const group = await this.groupsRepo.findGroupById(groupId);
    if (!group) throw GroupsError.groupNotFound(groupId);

    const members = await this.groupsRepo.findMembersByGroupId(groupId);
    if (!members.some((m) => m.user.id === userId)) {
      throw GroupsError.notMember();
    }

    const habit = await this.groupsRepo.findHabitById(habitId);
    if (!habit || habit.group.id !== groupId) {
      throw GroupsError.habitNotFound(habitId);
    }

    const user = await this.usersRepo.findOneById(userId);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        statusCode: 404,
        message: 'User not found',
      });
    }

    // To simplify: we don't strictly block multiple trackings per day here, 
    // but in a real app we would check `countTrackingsForHabitAndUser` and date.
    
    const tracking = new GroupTrackingEntity();
    tracking.habit = habit;
    tracking.user = user;
    tracking.date = new Date();
    tracking.status = trackDto.status || TrackingStatus.COMPLETED;

    await this.groupsRepo.createTracking(tracking);

    // If completed, add points to group
    if (tracking.status === TrackingStatus.COMPLETED) {
      group.points += habit.pointsReward;
      this.checkAndUnlockBadges(group);
      await this.groupsRepo.saveGroup(group);
    }

    return tracking;
  }

  async updateMemberRole(
    groupId: string,
    targetUserId: string,
    newRole: GroupRole,
    requesterId: string,
  ) {
    const group = await this.groupsRepo.findGroupById(groupId);
    if (!group) throw GroupsError.groupNotFound(groupId);

    const members = await this.groupsRepo.findMembersByGroupId(groupId);
    const requester = members.find((m) => m.user.id === requesterId);
    if (!requester || requester.role !== GroupRole.ADMIN) {
      throw GroupsError.notMember(); // Only the main ADMIN can promote/demote (or change this if needed)
    }

    const targetMember = members.find((m) => m.user.id === targetUserId);
    if (!targetMember) throw GroupsError.notMember();

    // The creator (first admin) can promote others to CO_ADMIN or ADMIN.
    targetMember.role = newRole;
    await this.groupsRepo.addMember(targetMember); // save the updated member
    
    return targetMember;
  }

  async getGroupDetails(groupId: string) {
    const group = await this.groupsRepo.findGroupById(groupId);
    if (!group) throw GroupsError.groupNotFound(groupId);
    return group;
  }

  private checkAndUnlockBadges(group: GroupEntity) {
    if (!group.badges) group.badges = [];
    
    const thresholds = [
      { points: 100, name: 'Bronze' },
      { points: 500, name: 'Silver' },
      { points: 1000, name: 'Gold' },
      { points: 5000, name: 'Platinum' },
      { points: 10000, name: 'Diamond' },
    ];

    for (const t of thresholds) {
        if (group.points >= t.points && !group.badges.includes(t.name)) {
            group.badges.push(t.name);
        }
    }
  }
}
