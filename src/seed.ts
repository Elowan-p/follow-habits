import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GroupsService } from './context/groups/groups.service';
import { HabitCategory } from './context/habits/enums/habit-category.enum';
import { TrackingStatus } from './context/groups/entities/group-tracking.entity';
import { mockGroupsData } from './context/groups/groups.mock';
import { UsersRepositoryInterface } from './context/users/users.repository.interface';
import { UserEntity } from './context/users/entities/user.entity';
import { ROLE_ADMIN } from './core/rights/roles';
import { Connection } from 'mysql2';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Application content loaded for seeding...');

  try {
    const groupsService = app.get(GroupsService);
    const usersRepo = app.get(UsersRepositoryInterface);

    // 1. Ensure mock users exist
    const userIds = ['usr-leo', 'usr-mia', 'usr-sam'];
    for (const id of userIds) {
      const existing = await usersRepo.findOneById(id);
      if (!existing) {
        console.log(`Creating mock user: ${id}...`);
        const user = new UserEntity();
        user.id = id;
        user.name = `MockUser-${id}`;
        user.email = `${id}@example.com`;
        user.rights = ROLE_ADMIN; // give all permissions for testing
        // For bypass, we save manually using repo. Usually auth handles this.
        await (usersRepo as any).repository.save(user); // bypass
      }
    }

    // 2. Insert mock groups
    for (const groupData of mockGroupsData) {
      console.log(`Seeding group: ${groupData.name}...`);
      
      // We take the first admin user to create it
      const adminId = groupData.members.find(m => m.role === 'admin')?.userId || userIds[0];
      
      const createdGroup = await groupsService.createGroup({
        name: groupData.name,
        description: groupData.description
      }, adminId);

      if (!createdGroup) {
         console.error(`Failed to create group ${groupData.name}`);
         continue;
      }

      // Join other members
      for (const member of groupData.members) {
        if (member.userId !== adminId) {
          await groupsService.joinGroup(createdGroup.id, member.userId);
        }
      }

      // Add habits
      const habitIdMap = new Map();
      for (const habit of groupData.habits) {
        const h = await groupsService.addHabit(createdGroup.id, adminId as string, {
          name: habit.name,
          category: habit.category,
          pointsReward: habit.pointsReward,
        });
        habitIdMap.set(habit.id, h.id);
      }

      // Add trackings
      if (groupData.trackings) {
          for (const tracking of groupData.trackings) {
             const realHabitId = habitIdMap.get(tracking.habitId);
             if (realHabitId) {
                 await groupsService.trackHabit(
                     createdGroup.id, 
                     realHabitId, 
                     tracking.userId, 
                     { status: tracking.status }
                 );
             }
          }
      }
      
      console.log(`Finished seeding group ${groupData.name}`);
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
