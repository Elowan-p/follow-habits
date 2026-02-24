import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsRepositoryInterface } from './groups.repository.interface';
import { GroupEntity } from './entities/group.entity';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupHabitEntity } from './entities/group-habit.entity';
import { GroupTrackingEntity } from './entities/group-tracking.entity';

@Injectable()
export class GroupsRepository implements GroupsRepositoryInterface {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,
    @InjectRepository(GroupMemberEntity)
    private readonly memberRepo: Repository<GroupMemberEntity>,
    @InjectRepository(GroupHabitEntity)
    private readonly habitRepo: Repository<GroupHabitEntity>,
    @InjectRepository(GroupTrackingEntity)
    private readonly trackingRepo: Repository<GroupTrackingEntity>,
  ) {}

  async createGroup(group: GroupEntity): Promise<GroupEntity> {
    return this.groupRepo.save(group);
  }

  async findGroupById(id: string): Promise<GroupEntity | null> {
    return this.groupRepo.findOne({
      where: { id },
      relations: ['members', 'habits', 'habits.trackings'],
    });
  }

  async saveGroup(group: GroupEntity): Promise<GroupEntity> {
    return this.groupRepo.save(group);
  }

  async addMember(member: GroupMemberEntity): Promise<GroupMemberEntity> {
    return this.memberRepo.save(member);
  }

  async findMembersByGroupId(groupId: string): Promise<GroupMemberEntity[]> {
    return this.memberRepo.find({ 
      where: { group: { id: groupId } },
      relations: ['user'] // added relation to avoid user.id being undefined
    });
  }

  async createHabit(habit: GroupHabitEntity): Promise<GroupHabitEntity> {
    return this.habitRepo.save(habit);
  }

  async findHabitById(id: string): Promise<GroupHabitEntity | null> {
    return this.habitRepo.findOne({
      where: { id },
      relations: ['group'],
    });
  }

  async createTracking(
    tracking: GroupTrackingEntity,
  ): Promise<GroupTrackingEntity> {
    return this.trackingRepo.save(tracking);
  }

  async countTrackingsForHabitAndUser(
    habitId: string,
    userId: string,
  ): Promise<number> {
    return this.trackingRepo.count({
      where: { habit: { id: habitId }, user: { id: userId } },
    });
  }
}
