import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { UserEntity } from '../../context/users/entities/user.entity';
import { GroupEntity } from './entities/group.entity';
import { GroupMemberEntity, GroupRole } from './entities/group-member.entity';
import { GroupHabitEntity } from './entities/group-habit.entity';
import { HabitCategory } from '../../context/habits/enums/habit-category.enum';
import { UsersError } from '../../context/users/error/users.error';
import { GroupsError } from './error/groups.error';
import { TrackingStatus } from './entities/group-tracking.entity';
import { UsersRepositoryInterface } from '../../context/users/users.repository.interface';

describe('GroupsService', () => {
  let service: GroupsService;

  const mockGroupsRepo = {
    createGroup: jest.fn(),
    findGroupById: jest.fn(),
    saveGroup: jest.fn(),
    addMember: jest.fn(),
    findMembersByGroupId: jest.fn(),
    createHabit: jest.fn(),
    findHabitById: jest.fn(),
    createTracking: jest.fn(),
    countTrackingsForHabitAndUser: jest.fn(),
  };

  const mockUsersRepo = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: 'GroupsRepositoryInterface',
          useValue: mockGroupsRepo,
        },
        {
          provide: UsersRepositoryInterface,
          useValue: mockUsersRepo,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroup', () => {
    it('should create a group and make the creator an ADMIN', async () => {
      const mockUser = new UserEntity();
      mockUser.id = 'user-1';

      mockUsersRepo.findOneById.mockResolvedValue(mockUser);
      
      const mockGroup = new GroupEntity();
      mockGroup.id = 'group-1';
      mockGroup.name = 'Test Group';
      mockGroup.points = 0;
      mockGroup.badges = [];

      mockGroupsRepo.createGroup.mockResolvedValue(mockGroup);
      mockGroupsRepo.findGroupById.mockResolvedValue({
        ...mockGroup,
        members: [{ user: mockUser, role: GroupRole.ADMIN }],
      });

      const result = await service.createGroup(
        { name: 'Test Group', description: 'Desc' },
        'user-1',
      );

      expect(mockUsersRepo.findOneById).toHaveBeenCalledWith('user-1');
      expect(mockGroupsRepo.createGroup).toHaveBeenCalled();
      expect(mockGroupsRepo.addMember).toHaveBeenCalled();
      expect(result.members[0].role).toBe(GroupRole.ADMIN);
    });

    it('should throw UsersError if user not found', async () => {
      mockUsersRepo.findOneById.mockResolvedValue(null);

      await expect(
        service.createGroup({ name: 'Test' }, 'invalid-id'),
      ).rejects.toThrow(UsersError);
    });
  });

  describe('joinGroup', () => {
    it('should add a given user as a MEMBER to an existing group', async () => {
      const mockUser = new UserEntity();
      mockUser.id = 'user-2';
      
      const mockGroup = new GroupEntity();
      mockGroup.id = 'group-1';
      
      mockUsersRepo.findOneById.mockResolvedValue(mockUser);
      mockGroupsRepo.findGroupById.mockResolvedValue(mockGroup);
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([]);
      
      const savedMember = new GroupMemberEntity();
      savedMember.user = mockUser;
      savedMember.group = mockGroup;
      savedMember.role = GroupRole.MEMBER;
      
      mockGroupsRepo.addMember.mockResolvedValue(savedMember);

      const result = await service.joinGroup('group-1', 'user-2');

      expect(mockGroupsRepo.addMember).toHaveBeenCalled();
      expect(mockGroupsRepo.addMember.mock.calls[0][0].role).toBe(GroupRole.MEMBER);
      expect(result.id).toBe('group-1');
    });

    it('should throw UsersError if user not found', async () => {
      mockUsersRepo.findOneById.mockResolvedValue(null);
      await expect(service.joinGroup('g1', 'u1')).rejects.toThrow(UsersError);
    });

    it('should return the group without throwing if user is already a member', async () => {
      const mockUser = new UserEntity();
      mockUser.id = 'user-in-group';
      const mockGroup = new GroupEntity();
      mockGroup.id = 'g1';
      mockUsersRepo.findOneById.mockResolvedValue(mockUser);
      mockGroupsRepo.findGroupById.mockResolvedValue(mockGroup);
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: mockUser } as GroupMemberEntity
      ]);

      const result = await service.joinGroup('g1', 'user-in-group');
      // addMember should not be called again
      expect(mockGroupsRepo.addMember).not.toHaveBeenCalled();
      expect(result.id).toBe('g1');
    });
  });

  describe('addHabit', () => {
    let mockGroup: GroupEntity;
    let mockUser: UserEntity;

    beforeEach(() => {
      mockGroup = new GroupEntity();
      mockGroup.id = 'group-add-habit';
      mockUser = new UserEntity();
      mockUser.id = 'admin-user';

      mockGroupsRepo.findGroupById.mockResolvedValue(mockGroup);
      mockGroupsRepo.createHabit.mockResolvedValue(new GroupHabitEntity());
    });

    it('should succeed if user is ADMIN', async () => {
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: mockUser, role: GroupRole.ADMIN } as GroupMemberEntity
      ]);

      await service.addHabit('group-add-habit', 'admin-user', { name: 'Test Habit', category: HabitCategory.SPORT });
      expect(mockGroupsRepo.createHabit).toHaveBeenCalled();
    });

    it('should succeed if user is CO_ADMIN', async () => {
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: mockUser, role: GroupRole.CO_ADMIN } as GroupMemberEntity
      ]);

      await service.addHabit('group-add-habit', 'admin-user', { name: 'Test Habit', category: HabitCategory.SPORT });
      expect(mockGroupsRepo.createHabit).toHaveBeenCalled();
    });

    it('should throw if user is only MEMBER', async () => {
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: mockUser, role: GroupRole.MEMBER } as GroupMemberEntity
      ]);

      await expect(
        service.addHabit('group-add-habit', 'admin-user', { name: 'Test', category: HabitCategory.OTHER })
      ).rejects.toThrow(GroupsError);
    });
  });

  describe('updateMemberRole', () => {
    let mockGroup: GroupEntity;
    let adminUser: UserEntity;
    let regularUser: UserEntity;

    beforeEach(() => {
      mockGroup = new GroupEntity();
      mockGroup.id = 'group-roles';
      adminUser = new UserEntity();
      adminUser.id = 'admin-user';
      regularUser = new UserEntity();
      regularUser.id = 'regular-user';

      mockGroupsRepo.findGroupById.mockResolvedValue(mockGroup);
    });

    it('should allow ADMIN to promote a user', async () => {
      const targetMember = { user: regularUser, role: GroupRole.MEMBER } as GroupMemberEntity;
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: adminUser, role: GroupRole.ADMIN } as GroupMemberEntity,
        targetMember,
      ]);
      mockGroupsRepo.addMember.mockResolvedValue({ ...targetMember, role: GroupRole.CO_ADMIN } as GroupMemberEntity);

      const result = await service.updateMemberRole('group-roles', 'regular-user', GroupRole.CO_ADMIN, 'admin-user');

      expect(mockGroupsRepo.addMember).toHaveBeenCalled();
      expect(result.role).toBe(GroupRole.CO_ADMIN);
    });

    it('should throw if requester is CO_ADMIN or MEMBER', async () => {
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: adminUser, role: GroupRole.CO_ADMIN } as GroupMemberEntity,
        { user: regularUser, role: GroupRole.MEMBER } as GroupMemberEntity,
      ]);

      await expect(
        service.updateMemberRole('group-roles', 'regular-user', GroupRole.ADMIN, 'admin-user')
      ).rejects.toThrow(GroupsError);
    });
  });

  describe('trackHabit (Clash Royale Mechanics)', () => {
    let mockGroup: GroupEntity;
    let mockHabit: GroupHabitEntity;
    let mockUser: UserEntity;

    beforeEach(() => {
      mockGroup = new GroupEntity();
      mockGroup.id = 'group-1';
      mockGroup.points = 0;
      mockGroup.badges = [];

      mockHabit = new GroupHabitEntity();
      mockHabit.id = 'habit-1';
      mockHabit.pointsReward = 20; // 20 pts pour la démo
      mockHabit.group = mockGroup;

      mockUser = new UserEntity();
      mockUser.id = 'user-1';

      mockGroupsRepo.findGroupById.mockResolvedValue(mockGroup);
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: mockUser, group: mockGroup, role: GroupRole.MEMBER },
      ]);
      mockGroupsRepo.findHabitById.mockResolvedValue(mockHabit);
      mockUsersRepo.findOneById.mockResolvedValue(mockUser);
    });

    it('should add points to the group after tracking', async () => {
      await service.trackHabit('group-1', 'habit-1', 'user-1', {
        status: TrackingStatus.COMPLETED,
      });

      expect(mockGroupsRepo.createTracking).toHaveBeenCalled();
      expect(mockGroupsRepo.saveGroup).toHaveBeenCalled();
      
      // Points should be added
      expect(mockGroup.points).toBe(20);
    });

    it('should unlock Bronze badge when points reach 100', async () => {
      // Setup the group right before reaching Bronze
      mockGroup.points = 90;

      await service.trackHabit('group-1', 'habit-1', 'user-1', {
        status: TrackingStatus.COMPLETED,
      });

      expect(mockGroup.points).toBe(110);
      expect(mockGroup.badges).toContain('Bronze');
    });

    it('should unlock Silver badge but keep Bronze when passing 500', async () => {
      mockGroup.points = 490;
      mockGroup.badges = ['Bronze']; // Déjà débloqué

      await service.trackHabit('group-1', 'habit-1', 'user-1', {
        status: TrackingStatus.COMPLETED,
      });

      expect(mockGroup.points).toBe(510);
      expect(mockGroup.badges).toContain('Bronze');
      expect(mockGroup.badges).toContain('Silver');
    });

    it('should throw if user is not a member of the group', async () => {
      // Simulate that only user-2 is a member, not user-1
      mockGroupsRepo.findMembersByGroupId.mockResolvedValue([
        { user: { id: 'user-2' }, group: mockGroup, role: GroupRole.MEMBER },
      ]);

      await expect(
        service.trackHabit('group-1', 'habit-1', 'user-1', { status: TrackingStatus.COMPLETED }),
      ).rejects.toThrow(GroupsError);
    });
  });
});
