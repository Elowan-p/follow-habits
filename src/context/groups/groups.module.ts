import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupsRepository } from './groups.repository';
import { GroupEntity } from './entities/group.entity';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupHabitEntity } from './entities/group-habit.entity';
import { GroupTrackingEntity } from './entities/group-tracking.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      GroupMemberEntity,
      GroupHabitEntity,
      GroupTrackingEntity,
    ]),
    UsersModule,
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    {
      provide: 'GroupsRepositoryInterface',
      useClass: GroupsRepository,
    },
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
