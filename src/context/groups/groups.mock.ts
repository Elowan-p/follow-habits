import { HabitCategory } from '../habits/enums/habit-category.enum';
import { GroupRole } from './entities/group-member.entity';
import { TrackingStatus } from './entities/group-tracking.entity';

export const mockGroupsData = [
  {
    id: 'grp-001',
    name: 'Les Spartiates',
    description: 'Objectif : Devenir des machines de guerre (Santé & Sport)',
    points: 1250,
    badges: ['Bronze', 'Silver', 'Gold'],
    members: [
      {
        userId: 'usr-leo',
        role: GroupRole.ADMIN,
        joinedAt: new Date('2026-01-10T10:00:00Z'),
      },
      {
        userId: 'usr-mia',
        role: GroupRole.MEMBER,
        joinedAt: new Date('2026-01-12T14:30:00Z'),
      },
    ],
    habits: [
      {
        id: 'hab-001',
        name: 'Faire 50 pompes',
        category: HabitCategory.HEALTH,
        pointsReward: 50,
      },
      {
        id: 'hab-002',
        name: "Boire 2L d'eau",
        category: HabitCategory.HEALTH,
        pointsReward: 10,
      },
    ],
    trackings: [
      {
        userId: 'usr-leo',
        habitId: 'hab-001',
        date: new Date('2026-02-20T08:00:00Z'),
        status: TrackingStatus.COMPLETED,
      },
      {
        userId: 'usr-mia',
        habitId: 'hab-001',
        date: new Date('2026-02-20T09:30:00Z'),
        status: TrackingStatus.COMPLETED,
      },
      {
        userId: 'usr-leo',
        habitId: 'hab-001',
        date: new Date('2026-02-21T07:45:00Z'),
        status: TrackingStatus.COMPLETED,
      },
    ],
  },
  {
    id: 'grp-002',
    name: 'Hackers Nocturnes',
    description:
      'Coder tous les jours une heure pour débloquer le badge Diamant !',
    points: 420,
    badges: ['Bronze'],
    members: [
      {
        userId: 'usr-sam',
        role: GroupRole.ADMIN,
        joinedAt: new Date('2026-02-01T22:00:00Z'),
      },
    ],
    habits: [
      {
        id: 'hab-003',
        name: '1 Commit par jour minimum',
        category: HabitCategory.LEARNING,
        pointsReward: 20,
      },
    ],
  },
];
