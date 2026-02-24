import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum GroupRole {
  ADMIN = 'admin',
  CO_ADMIN = 'co_admin',
  MEMBER = 'member',
}

@Entity('group_members')
export class GroupMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GroupEntity, (group) => group.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
