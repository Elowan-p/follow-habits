import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GroupHabitEntity } from './group-habit.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum TrackingStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

@Entity('group_trackings')
export class GroupTrackingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GroupHabitEntity, (habit) => habit.trackings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_habit_id' })
  habit: GroupHabitEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({
    type: 'enum',
    enum: TrackingStatus,
    default: TrackingStatus.COMPLETED,
  })
  status: TrackingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
