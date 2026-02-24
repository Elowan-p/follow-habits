import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { HabitCategory } from '../../habits/enums/habit-category.enum';
import { GroupTrackingEntity } from './group-tracking.entity';

@Entity('group_habits')
export class GroupHabitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GroupEntity, (group) => group.habits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @OneToMany(() => GroupTrackingEntity, (tracking) => tracking.habit, {
    cascade: true,
  })
  trackings: GroupTrackingEntity[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: HabitCategory,
    default: HabitCategory.OTHER,
  })
  category: HabitCategory;

  @Column({ type: 'int', default: 10 })
  pointsReward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
