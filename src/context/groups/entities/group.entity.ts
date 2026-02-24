import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GroupMemberEntity } from './group-member.entity';
import { GroupHabitEntity } from './group-habit.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'simple-array', nullable: true })
  badges: string[];

  @OneToMany(() => GroupMemberEntity, (member) => member.group, {
    cascade: true,
  })
  members: GroupMemberEntity[];

  @OneToMany(() => GroupHabitEntity, (habit) => habit.group, {
    cascade: true,
  })
  habits: GroupHabitEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
