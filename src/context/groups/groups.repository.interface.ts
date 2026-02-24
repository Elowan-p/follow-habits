import { GroupEntity } from './entities/group.entity';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupHabitEntity } from './entities/group-habit.entity';
import { GroupTrackingEntity } from './entities/group-tracking.entity';

export interface GroupsRepositoryInterface {
  // Group CRUD
  createGroup(group: GroupEntity): Promise<GroupEntity>;
  findGroupById(id: string): Promise<GroupEntity | null>;
  saveGroup(group: GroupEntity): Promise<GroupEntity>;

  // Members
  addMember(member: GroupMemberEntity): Promise<GroupMemberEntity>;
  findMembersByGroupId(groupId: string): Promise<GroupMemberEntity[]>;

  // Habits
  createHabit(habit: GroupHabitEntity): Promise<GroupHabitEntity>;
  findHabitById(id: string): Promise<GroupHabitEntity | null>;

  // Trackings
  createTracking(tracking: GroupTrackingEntity): Promise<GroupTrackingEntity>;
  countTrackingsForHabitAndUser(
    habitId: string,
    userId: string,
  ): Promise<number>;
}
